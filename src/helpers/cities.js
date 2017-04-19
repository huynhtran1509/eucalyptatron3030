import distance from 'jaro-winkler';
import "fs";
var fs = this.get("fs");
import 'path';
import cities from '../../data/cities';
export function isPossibleCity(city) {
    var i = 0, possibleCities = [], cityScore;
    var len = cities.length;
    for (; i < len; i++) {
        cityScore = distance(cities[i].city || '', city, { caseSensitive: false });
        if (cityScore > 0.95) {
            return true;
        }
    }
    return false;
}
/**
 * Given a city and a stateAbbr, get back a list of information
 * about that city. The state abbr is optional. If included, the
 * results should be more accurate.
 *
 * The final result is sorted where element "0" is the closest
 * match to the requested city state.
 *
 * If there were no matches, an empty list is returned.
 */
export function getCityInfo(city, stateAbbr) {
    var i = 0, possibleCities = [], cityData, cityScore, stateScore;
    var len = cities.length;
    for (; i < len; i++) {
        cityData = cities[i];
        cityScore = distance(cityData.city || '', city, { caseSensitive: false });
        if (cityScore > 0.95) {
            var possibleCity = { cityScore: cityScore, cityData: cityData, stateScore: 0 };
            if (stateAbbr) {
                stateScore = distance(cityData.state, stateAbbr, { caseSensitive: false });
                if (stateScore === 1) {
                    possibleCity.stateScore = stateScore;
                }
            }
            possibleCities.push(possibleCity);
        }
    }
    return possibleCities.sort(function (a, b) { return b.cityScore - a.cityScore; })
        .sort(function (a, b) { return b.stateScore - a.stateScore; });
}
/**
 * This function attempts to get city data from any given
 * utterance / raw string that the user provides. Returns
 * undefined if nothing was found.
 */
export function getCityDataFromUtterance(utterance) {
    var cleaned = utterance.trim().replace(/[^\w ]/gi, '');
    var words = cleaned.split(' ');
    // Get a list of possible cities from the utterance
    var single = words.filter(function (word) { return isPossibleCity(word); });
    // Overlapping city names, e.g. "what is playing in new york?"
    // --> [ 'what is', 'is playing', 'playing in', 'in new', 'new york' ]
    // --> only clusters that are determined to be cities are kept
    var double = words.reduce(function (acc, curr, i) {
        acc[i] = [curr];
        var prevIndex = i - 1;
        if (prevIndex >= 0) {
            acc[prevIndex] = acc[prevIndex].concat(curr);
        }
        return acc;
    }, []).filter(function (wordCluster) { return wordCluster.length === 2; })
        .map(function (wordCluster) { return wordCluster.join(' '); })
        .filter(function (word) { return isPossibleCity(word); });
    // Note that we put preference on double as it's more specific.
    var possibleCities = double.concat(single);
    // Get a list of possible states that appear in the
    // cities (words of length 2, that appear after a possible
    // city name
    var possibleStates = possibleCities.reduce(function (acc, city) {
        // split on the city. state should appear after the city name.
        var possibleState = (utterance.split(city)[1] || '')
            .replace(/[^\w ]/gi, '') // remove comma's, question marks, etc.
            .trim() // remove white space around the second half of the split.
            .split(' ')[0]; // finally, split on spaces & grab first word in second half.
        // If it is a word of length 2, we can consider it a possible state
        // beacuse it appeared after a possible city.
        if (possibleState.length == 2) {
            acc = acc.concat(possibleState);
        }
        return acc;
    }, []);
    // cycle through all possible combinations and store
    // them in thir results list
    var results = [];
    possibleCities.forEach(function (city) {
        var cityInfo = getCityInfo(city);
        if (cityInfo.length > 0) {
            // We only care about the _best_ result that comes
            // back from the query
            results.push(cityInfo.sort(function (a, b) { return b.cityScore - a.cityScore; })[0]);
        }
        possibleStates.forEach(function (state) {
            var cityState = getCityInfo(city, state);
            if (cityState.length > 0) {
                // likewise, we only want the best result.
                results.push(cityState[0]);
            }
        });
    });
    // Now that we have the final results, sort them by them
    // by the state, then the city scores
    var sortedResults = results.sort(function (a, b) {
        // let them fight
        if (a.stateScore && b.stateScore) {
            return b.stateScore - a.stateScore;
        }
        // give precidence of entries that have a state score
        if (b.stateScore && !a.stateScore) {
            return 1;
        }
        return 0;
    }).sort(function (a, b) {
        return b.cityScore - a.cityScore;
    });
    // Pull out the first sorted result, else return undefined
    // if nothing was found
    return sortedResults.length > 0 ? sortedResults[0].cityData : void 0;
}
// console.log(getCityDataFromUtterance('new york'));
// console.time('foo');
// console.getCityDataFromUtterance('what is playing in washington dc?'));
// console.timeEnd('foo');
