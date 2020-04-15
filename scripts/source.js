init();

/*todo:
  -balance on start and on ongoing game -> if ongoing sum players log with current money 
  -update on log update  rather than on player board update
*/

function init() {
  if (
    document.location.origin == "https://boardgamearena.com" &&
    document.location.pathname.includes("forsale")
  ) {
    setTimeout(() => {
      //vizualize players resources
      vizualizeResources();

      const config = { attributes: true, childList: true, subtree: true };
      let coins = document.querySelectorAll("#coinsInHand")[0].textContent;
      //console.log(`Parsed number of coins: ${coins}`);
      document.querySelectorAll(".cp_board").forEach((e) => {
        let observer = new MutationObserver(() => {
          gameState(coins * 1000);
        });
        observer.observe(e, config);
      });
    }, 4000);
  }
}
function gameState(startCash) {
  let players = {};

  document.querySelectorAll(".player-name > a").forEach((e) => {
    players[e.textContent] = { balance: startCash, cards: [] };
  });

  Array.from(document.querySelectorAll("#logs > div > div"))
    .reverse()
    .forEach((log) => {
      if (log.childNodes.length == 4) {
        let playerName = log.childNodes[1].textContent.replace(" ", "-");
        if (log.childNodes[3].textContent.match(/\d+ k\$.+\d+$/g)) {
          //scenariusz kupowania
          let nums = log.childNodes[3].textContent.match(/\d+/g);

          players[playerName].balance -= nums[0] * 1000;
          players[playerName].cards.push(nums[1]);
        } else if (
          log.childNodes[3].textContent.match(/\d+ [^k\$].+\d+ k\$/g)
        ) {
          //scenariusz sprzedawania
          let nums = log.childNodes[3].textContent.match(/\d+/g);

          players[playerName].balance += nums[1] * 1000;
          players[playerName].cards = players[playerName].cards.filter(
            (card) => card != nums[0]
          );
        }
      }
    });

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
      player[1]["balance"]
    );

    playersBalance.appendChild(balanceLabel);
    playersBalance.appendChild(highlightedBalance);
  });
}

function vizualizeResources() {
  document.querySelectorAll(".player_board_inner").forEach((e) => {
    const playerName = e.querySelector(".player-name > a")?.text;
    let playerResources = tagCreator("div");

    let cards = tagCreator("div", `${playerName}-cards`);
    let balance = tagCreator("div", `${playerName}-balance`);

    playerResources.appendChild(cards);
    playerResources.appendChild(balance);

    e.appendChild(playerResources);
  });
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
