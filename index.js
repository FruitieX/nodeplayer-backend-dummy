var _ = require('underscore');

var dummyBackend = {};
dummyBackend.name = 'dummy';

var config;
var player;
var logger;

var encodeSong = function(origStream, seek, song, progCallback, errCallback) {
    if (song.songID === 'shouldCauseError') {
        errCallback(song, 'dummy encoding error');
    } else if (song.songID === 'shouldPrepareForever') {
        progCallback(song, 1024, false);
    } else {
        progCallback(song, 1024, false);
        progCallback(song, 1024, false);
        progCallback(song, 768, false);
        progCallback(song, 0, true);
    }

    return function(err) {
        errCallback(song, 'canceled preparing: ' + song.songID + ': ' + err);
    };
};

dummyBackend.prepareSong = function(song, progCallback, errCallback) {
    if(song.songID === 'shouldBePrepared') {
        progCallback(song, true, true);
    } else {
        return encodeSong(null, 0, song, progCallback, errCallback);
    }
};

dummyBackend.isPrepared = function(song) {
    return (song.songID === 'shouldBePrepared');
};

dummyBackend.search = function(query, callback, errCallback) {
    var results = {};
    results.songs = {};

    if(query.terms === 'shouldCauseError') {
        errCallback('dummy search error');
    } else {
        for (var i = 0; i < config.searchResultCnt; i++) {
            results.songs['dummyId' + i] = {
                artist: 'dummyArtist' + i,
                title: 'dummyTitle' + i,
                album: 'dummyAlbum' + i,
                albumArt: null,
                duration: 123456,
                songID: 'dummyId' + i,
                score: i,
                backendName: 'dummy',
                format: 'opus'
            };
        }

        callback(results);
    }
};

dummyBackend.init = function(_player, _logger, callback) {
    player = _player;
    config = _player.config;
    logger = _logger;

    if (player.dummyShouldError) {
        callback('dummy error at dummyBackend init');
    } else {
        callback();
    }
};
module.exports = dummyBackend;
