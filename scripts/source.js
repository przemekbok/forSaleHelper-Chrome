init();

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
    // console.log(
    //   `${player[0]}: cards:<${player[1]["cards"].join(" ")}>, balance:${
    //     player[1]["balance"]
    //   }$`
    // );
    let playersCards = document.querySelector(`.${player[0]}-cards`);
    playersCards.innerHTML = "";
    let open = document.createElement("span");
    open.textContent = "cards:< ";
    playersCards.appendChild(open);
    player[1]["cards"].sort().forEach((card) => {
      playersCards.appendChild(colorizeCard(card));
      let separator = document.createElement("span");
      separator.textContent = " ";
      playersCards.appendChild(separator);
    });
    let close = document.createElement("span");
    close.textContent = ">";
    playersCards.appendChild(close);
    let playersBalance = document.querySelector(`.${player[0]}-balance`);
    let highlightedBalance = document.createElement("span");
    highlightedBalance.style = "background-color:white;font-weight:bold";
    playersBalance.appendChild(highlightedBalance);
  });
}

function vizualizeResources() {
  document.querySelectorAll(".player_board_inner").forEach((e) => {
    let playerName = e.querySelector(".player-name > a")?.text;
    let playerResources = document.createElement("div");
    let cards = document.createElement("div");
    cards.classList.add(playerName + "-cards");
    let balance = document.createElement("div");
    balance.classList.add(playerName + "-balance");
    playerResources.appendChild(cards);
    playerResources.appendChild(balance);
    e.appendChild(playerResources);
  });
}

function colorizeCard(card) {
  let spanTag = document.createElement("span");
  spanTag.id = `number-${card}`;
  spanTag.textContent = card;
  return spanTag;
}
