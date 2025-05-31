const board = Chessboard('board', {
  draggable: true,
  position: 'start',
  onDrop: onDrop
});
const game = new Chess();

const room = location.hash.slice(1) || Math.random().toString(36).substring(2, 8);
document.getElementById('room').textContent = room;
location.hash = room;

const movesRef = db.ref('rooms/' + room);

function onDrop(source, target) {
  const move = game.move({ from: source, to: target, promotion: 'q' });
  if (move === null) return 'snapback';
  movesRef.push(move);
}

movesRef.on('child_added', snapshot => {
  const move = snapshot.val();
  game.move(move);
  board.position(game.fen());
});
