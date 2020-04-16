init();

/*
DA RULEZ:
-variables and comments named in english language  
-camelCase
*/

/*todo:
  -refactor for gameState, it's freakin big!
*/

function init() {
  if (
    document.location.origin == "https://boardgamearena.com" &&
    document.location.pathname.includes("forsale")
  ) {
    setTimeout(() => {
      //vizualize players resources
      visualizeResources();
      visualizeCardsInDeck();

      const config = { attributes: true, childList: true, subtree: true };
      let coins = getStartingCoins();
      let log = document.querySelector("#logs");

      //set observer to observe logs and update visualizations
      let observer = new MutationObserver(() => {
        gameState(parseInt(coins));
      });
      observer.observe(log, config);
    }, 4000);
  }
}
function gameState(startCash) {
  let players = {};

  document.querySelectorAll(".player-name > a").forEach((e) => {
    players[e.textContent.replace(" ", "-")] = {
      balance: startCash,
      cards: [],
    };
  });

  players = synchronizeVisualsWithLogs(players);

  updateResourcesVisualization(players);
  updateDeckVisualization();
}

function getStartingCoins() {
  let mainPlayerCoins = document.querySelector(".cp_board").children[2]
    .children[1].textContent;
  return parseInt(mainPlayerCoins) + getValueFromLog();
}

function visualizeCardsInDeck() {
  let whiteboard = document.querySelector("#complete_table > .whiteblock");
  let visualDeck = tagCreator("div", undefined, "deck-visualization");

  whiteboard.insertBefore(visualDeck, whiteboard.children[0]);
}

function updateDeckVisualization() {
  let visualDeck = document.querySelector("#deck-visualization");
  visualDeck.innerHTML = "";
  //obtain array with current deck
  let deck = [...new Array(30).keys()].map((i) => i + 1);
  let outOfDeck = getValueFromLog("cards").map((card) => parseInt(card));

  let diffrence = deck.filter((crd) => !outOfDeck.includes(crd));

  //convert it to HTML tags
  diffrence.forEach((card) => {
    visualDeck.appendChild(colorizeCard(card));

    let separator = tagCreator("span", ...new Array(3), " ");
    visualDeck.appendChild(separator);
  });
}

function visualizeResources() {
  document.querySelectorAll(".player_board_inner").forEach((e) => {
    const playerName = e
      .querySelector(".player-name > a")
      ?.text.replace(" ", "-");
    let playerResources = tagCreator("div");

    let cards = tagCreator("div", `${playerName}-cards`);
    let balance = tagCreator("div", `${playerName}-balance`);

    playerResources.appendChild(cards);
    playerResources.appendChild(balance);

    e.appendChild(playerResources);
  });
}

function updateResourcesVisualization(players) {
  Object.entries(players).forEach((player) => {
    let playersCards = document.querySelector(`.${player[0]}-cards`);
    playersCards.innerHTML = "";

    let open = tagCreator("span", ...new Array(3), "cards:< ");
    playersCards.appendChild(open);

    player[1]["cards"]
      .sort((a, b) => a - b)
      .forEach((card) => {
        playersCards.appendChild(colorizeCard(card));

        let separator = tagCreator("span", ...new Array(3), " ");
        playersCards.appendChild(separator);
      });

    let close = tagCreator("span", ...new Array(3), ">");
    playersCards.appendChild(close);

    let playersBalance = document.querySelector(`.${player[0]}-balance`);
    playersBalance.innerHTML = "";

    let balanceLabel = tagCreator("span", ...new Array(3), "balance:");

    let highlightedBalance = tagCreator(
      "span",
      ...new Array(2),
      "background-color:white;font-weight:bold",
      `${player[1]["balance"]} k$`
    );

    playersBalance.appendChild(balanceLabel);
    playersBalance.appendChild(highlightedBalance);
  });
}

function getValueFromLog(value = "coins") {
  let _switch = 0;
  let coins = 0;
  let cards = [];
  if (value == "cards") {
    _switch = 1;
  }

  //getting trade logs
  Array.from(document.querySelectorAll("#logs > div > div"))
    .reverse()
    .forEach((log) => {
      if (log.childNodes.length == 4) {
        let playerName = log.childNodes[1].textContent.replace(" ", "");
        //it derivates from
        if (log.childNodes[3].textContent.match(/\d+ k\$.+\d+$/g)) {
          let nums = log.childNodes[3].textContent.match(/\d+/g);

          if (!_switch) {
            let mainPlayerName = document
              .querySelector(".player_board_inner > .player-name > a")
              ?.text.replace(" ", "");
            if (playerName == mainPlayerName) {
              coins += parseInt(nums[0]);
            }
          } else if (_switch) {
            cards.push(nums[1]);
          }
        }
      }
    });
  return _switch ? cards : parseInt(coins);
}

function synchronizeVisualsWithLogs(players) {
  Array.from(document.querySelectorAll("#logs > div > div"))
    .reverse()
    .forEach((log) => {
      if (log.childNodes.length == 4) {
        let playerName = log.childNodes[1].textContent.replace(" ", "-");
        if (log.childNodes[3].textContent.match(/\d+ k\$.+\d+$/g)) {
          //scenariusz kupowania
          let nums = log.childNodes[3].textContent.match(/\d+/g);

          players[playerName].balance -= parseInt(nums[0]);
          players[playerName].cards.push(nums[1]);
        } else if (
          log.childNodes[3].textContent.match(/\d+ [^k\$].+\d+ k\$/g)
        ) {
          //scenariusz sprzedawania
          let nums = log.childNodes[3].textContent.match(/\d+/g);

          players[playerName].balance += parseInt(nums[1]);
          players[playerName].cards = players[playerName].cards.filter(
            (card) => card != nums[0]
          );
        }
      }
    });
  return players;
}

function colorizeCard(card) {
  return tagCreator("span", undefined, `number-${card}`, undefined, card);
}

function tagCreator(tagType, _class, id, style, text) {
  let tag = document.createElement(tagType);
  if (_class) tag.classList.add(_class);
  if (id) tag.id = id;
  if (style) tag.style = style;
  if (text) tag.textContent = text;

  return tag;
}
