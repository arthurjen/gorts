const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const db = admin.database();
const playersRef = db.ref('players');
const gamesRef = db.ref('games');
const movesRef = db.ref('moves');
const userGamesRef = db.ref('userGames');

exports.playerQueue = functions.database.ref('/players/{uid}').onCreate((snapshot, context) => {
  const { uid } = context.params;

  return playersRef.once('value')
    .then(snapshot => {
      const [player] = Object.keys(snapshot.val())
        .filter(key => key !== uid);

        if(!player) return null;

        const newGameRef = gamesRef.push();

        return Promise.all([
          newGameRef.set({ player1: uid, player2: player }),
          playersRef.child(uid).remove(),
          playersRef.child(player).remove(),
          userGamesRef.child(uid).child(newGameRef.key).set(true),
          userGamesRef.child(player).child(newGameRef.key).set(true)
        ]);
    });
});

exports.moveQueue = functions.database.ref('/moves/{gameKey}/{uid}').onCreate((snapshot, context) => {

  const { gameKey } = context.params;

  const gameMovesRef = movesRef.child(gameKey);

  return gameMovesRef.once('value')
    .then(snapshot => {
      const game = snapshot.val();
      const moves = Object.keys(game)
        .map(key => ({
          uid: key,
          play: game[key]
        }));
      if(moves.length < 2) return null;

      const roundRef = games.Ref.child(gameKey).child('rounds').push();

      return Promise.all([
        gamesMovesRef.remove(),
        roundRef.set({
          moves,
          winner: calculateWinner(moves)
        })
      ]);
    });
});

const calculateWinner = ([a, b]) => {
  // Refund if tie;
  if(a === b) return null;

  // Undercutter wins;
  const limit = 3;
  if(b - a > limit) return a.uid;
  if(a - b > limit) return b.uid;

  // High number wins;
  return a > b ? a.uid : b.uid;
};