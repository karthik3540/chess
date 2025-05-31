const board = Chessboard('board', {
  draggable: true,
  position: 'start',
  onDrop: handleMove
});

const game = new Chess();
const room = window.location.hash.substring(1) || Math.random().toString(36).substring(2, 8);
document.getElementById('room').textContent = room;
window.location.hash = room;

const roomRef = db.ref('rooms/' + room);

// Handle incoming moves
roomRef.on('child_added', (snapshot) => {
  const move = snapshot.val();
  if (move && move.from && move.to) {
    game.move(move);
    board.position(game.fen());
  }
});

// Send your move to Firebase
function handleMove(source, target) {
  const move = game.move({ from: source, to: target, promotion: 'q' });
  if (move === null) return 'snapback';

  roomRef.push({ from: source, to: target });
}
