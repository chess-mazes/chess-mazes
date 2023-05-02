# Chess Mazes

**Chess Mazes** is a puzzle game that helps you visualize chess moves and avoid hanging pieces.

The game is based on the book ["Chess Mazes"](https://www.amazon.com/Chess-Mazes-Kind-Puzzle-Everyone/dp/1888690232) (2004) by Bruce Alberston.

## ♟️ How to Play

The game is hosted at:

[https://chess-mazes.vercel.app](https://chess-mazes.vercel.app)

Either drag and drop the pieces to move them, or click a target square to move the selected piece to it. The goal is to check the black king without having your pieces threatened.

### 🧩 Custom Puzzles

You can load custom puzzles by entering a [FEN string](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation) in the "Load FEN" dialog. If you have access to the original book, you can convert puzzles to FEN strings using tools such as [ChessVision.ai](https://chessvision.ai/).

## 💿 Installing and running locally

You can run the project locally with the following commands:

```
git clone https://github.com/chess-mazes/chess-mazes
cd chess-mazes
git checkout prod # Checkout the develop branch
npm install # Install prerequisites
npm run dev # Start the server
```

### Using Docker

To build and use the docker image, in the `chess-mazes` directory, run:

```
docker-compose up
```

## 🤝 Contributing

Check out the [contributing guide](CONTRIBUTING.md) for more information.

## 📜 License

The puzzles that appear in the game are taken from the book ["Chess Mazes"](https://www.amazon.com/Chess-Mazes-Kind-Puzzle-Everyone/dp/1888690232) (2004) by Bruce Alberston, and licensed under the "Fair Use" clause of the US Copyright Law.

The assets (sounds, images) are licensed under Creative Commons Zero (CC0) and are attributed to their respective creators.

The game implementation is licensed under the [MIT license](https://opensource.org/license/mit/).

![](https://images.ctfassets.net/e5382hct74si/78Olo8EZRdUlcDUFQvnzG7/fa4cdb6dc04c40fceac194134788a0e2/1618983297-powered-by-vercel.svg)
