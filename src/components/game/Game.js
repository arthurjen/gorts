import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getGame } from './reducers';
import { getUser } from '../app/reducers';
import { loadGame, unloadGame, move } from './actions';

class Game extends Component {
  static propTypes = {
    match: PropTypes.object,
    game: PropTypes.object,
    user: PropTypes.object,
    move: PropTypes.func.isRequired,
    loadGame: PropTypes.func.isRequired,
    unloadGame: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { match, loadGame } = this.props;
    loadGame(match.params.gameKey);
  }

  componentWillUnmount() {
    const { match, unloadGame } = this.props;
    unloadGame(match.params.gameKey);
  }

  render() {
    const { game, user, move } = this.props;
    if(!game || !user) return null;

    const { uid } = user;
    const opponentId = Object.keys(game).filter(key => key !== uid);
    // const who = player => player === uid ? 'YOU' : 'THEM';

    const you = game[uid];
    const opponent = game[opponentId];

    return (
      <section>
        <h2>Players</h2>
        {/* <p>{you} VS. {opponent}</p> */}

        <div>
          <h3>You</h3>
          <p>Wins: {you.wins}</p>
          <p>Troops: {you.troops}</p>

          <h3>Opponent</h3>
          <p>Wins: {opponent.wins}</p>
          <p>Troops: {opponent.troops}</p>
          {/* {game.rounds && Object.keys(game.rounds).map((key, i) => {
            const round = game.rounds[key];
            return (
              <li key={i}>
                <ul>
                  {round.moves.map(move => (
                    <li key={move.uid}>{who(move.uid)}: {move.play}</li>
                  ))}
                  <li>Winner: {who(round.winner)}</li>
                </ul>
              </li>
            );
          })} */}
        </div>

        <p>
          {buildArray(you.troops).map(play => (
            <button
              key={play}
              onClick={() => move(play)}>{play}</button>
          ))}
        </p>
      </section>
    );
  }
}

const buildArray = number => {
  let arr = [];
  for(let i = 0; i <= number; i++) {
    arr.push(i);
  }
  return arr;
};
 
export default connect(
  state => ({
    game: getGame(state),
    user: getUser(state)
  }),
  { loadGame, unloadGame, move }
)(Game);