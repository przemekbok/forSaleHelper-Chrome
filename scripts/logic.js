function gameState(startCash) {
  let players = {};

  Array.from(document.querySelectorAll(".player-name > a")).map((e) => {
    players[e.textContent] = { balance: startCash, cards: [] };
  });

  Array.from(document.querySelectorAll("#logs > div > div"))
    .reverse()
    .map((log) => {
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

  Object.entries(players).map((player) => {
    // console.log(
    //   `${player[0]}: cards:<${player[1]["cards"].join(" ")}>, balance:${
    //     player[1]["balance"]
    //   }$`
    // );
    document.querySelector(
      `.${player[0]}-cards`
    ).textContent = `cards:<${player[1]["cards"].join(" ")}>`;
    document.querySelector(
      `.${player[0]}-balance`
    ).textContent = `balance:${player[1]["balance"]}$`;
  });
}

(function init() {
  console.log("iniciated");
  //vizualize players resources
  vizualizeResources();

  const config = { attributes: true, childList: true, subtree: true };
  let coins = document.querySelectorAll("#coinsInHand")[0].textContent;
  console.log(`Parsed number of coins: ${coins}`);
  Array.from(document.querySelectorAll(".cp_board")).map((e) => {
    let observer = new MutationObserver(() => {
      gameState(coins * 1000);
    });
    observer.observe(e, config);
  });
});

function vizualizeResources() {
  Array.from(document.querySelectorAll(".player_board_inner")).map((e) => {
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
