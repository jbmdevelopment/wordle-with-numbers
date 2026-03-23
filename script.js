let gameStatus = {
  hasStarted: false
};
const elements = ["difficulty", "diff", "startGame", "mainGame", "triesText", "guessButton", "revealedAnswer"]; // store elements in array so we can iterate over them and access them easier :-)
// use this instead of writing document.getElementById("element") blah blah every time.
let fetchElement = element => document.getElementById(element);
class Wordle {
  constructor() {
    this.answer = [];
    // add a future update to add previous answer logs for certain guesses at certain slots to make it easier for the user.
    this.tries = 10;
    this.difficulty = "normal";
    this.difficultyScaling = 4; // default
    this.inputBoxes = ["slot1", "slot2", "slot3", "slot4"];
    this.revealedAnswer = fetchElement("revealedAnswer").innerText.split(""); // "XXXX"
  }
  switchDiff(difficulty) {
    this.difficulty = difficulty;
    switch (difficulty) {
      case "normal":
        this.difficultyScaling = 4;
        break;
      case "medium":
        this.difficultyScaling = 6;
        break;
      case "hard":
        this.difficultyScaling = 9;
        break;
    }
  }
  findRandom(min = 1, max = 9) {
    // (max - min) + min
    /* 
    We only want integers.
    We don't want duplicates.
    any harder modes can be added later.
    */
    let random;
    do {
      random = Math.floor(Math.random() * (max - min) + min);
    } while (this.answer.includes(random));
    return random;
  }
  init(starter) {
    if (starter) {
      console.log("Welcome to Wordle Remake");
      for (let i = 0; i < 4 /*this.difficultyScaling*/ ; i++) {
        let randomNum = this.findRandom();
        this.answer.push(randomNum);
      }
    }
    //this.answer = [8, 3, 2, 5];
  }
  get info() {
    return {
      answer: this.answer,
      tries: this.tries,
      difficulty: this.difficulty
    };
  }
  simulate() {
    if (!gameStatus.hasStarted) {
      let element = fetchElement(elements[1]);
      element.onchange = () => {
        this.switchDiff(element.value);
        console.log(`Selected ${element.value}`, this.difficulty);
      }
    } else {
      /*
          parallel list to match index with slot
      */
      console.log(this.answer, this.tries);

      /*
      console.log(Number(this.answer.join("")), Number(this.revealedAnswer.join(""));
      Number(this.answer.join("")) === Number(this.revealedAnswer.join(""))
      UNUSED CODE
      */
      //  check if answer array equals revealed answer array (meaning the user guessed right!)
      if (this.answer.length === this.revealedAnswer.length && this.answer.every((element, index) => element === this.revealedAnswer[index])) {
        fetchElement(elements[4]).innerText = `Good Guess! Tries: ${10 - this.tries}`;
        fetchElement(elements[5]).style.display = "none";
      } else if (this.tries == 0) {
        fetchElement(elements[4]).innerText = `Correct Answer: ${this.answer.join("")}, you ran out of tries!`;
        fetchElement(elements[5]).style.display = "none";
        for (let element = 0; element < this.inputBoxes.length; element++) {
          fetchElement(this.inputBoxes[element]).style.display = "none";
        }
        6
      } else {
        fetchElement(elements[5]).onclick = () => {
          this.tries = Math.max(0, this.tries - 1);
          for (let element = 0; element < this.inputBoxes.length; element++) {
            for (let slot = 0; slot < this.answer.length; slot++) {
              let val = /*this.answer.indexOf(*/ Number(fetchElement(this.inputBoxes[element]).value) //);i
              console.log(val);
              if (element === slot) {
                if (!isNaN(val) && val != 0) { // bug with index. (you can put 3 at the end box, but if the answer index is 3, it will still remove that box anyways and say you were right at the index) (fix this)
                  /* should be fixed now. */
                  if (val === this.answer[slot] /*&& element === slot*/ ) {
                    //console.log(this.answer.indexOf(Number(fetchElement(this.inputBoxes[element]).value)))
                    //console.log(`guessed correctly at slot ${this.answer[slot + 1]}`);
                    //this.revealedAnswer.splice(slot, 1, val);
                    this.revealedAnswer[slot] = this.answer[slot];
                    fetchElement(elements[6]).innerText = this.revealedAnswer.slice(0, this.answer.length).join("");
                    // replace the X with the answer at the index guessed
                    fetchElement(elements[4]).innerText = `Tries: ${this.tries}`;

                    fetchElement(this.inputBoxes[element]).style.display = "none";
                    // remove that input box. add future update to just make it not typeable anymore
                  } else {
                    fetchElement(elements[4]).innerText = `Tries: ${this.tries}`;
                  }
                  //console.log(inputVal);
                } else {
                  alert(`Please fix your answer at ${slot + 1}`);
                  break;
                }
              }
            }
          }
        }
      }
    }
  }
}
const wordle = new Wordle();
setTimeout(() => {
  fetchElement(elements[2]).onclick = function() {
    gameStatus.hasStarted = true;
    fetchElement(elements[0]).style.display = "none";
    fetchElement(elements[3]).style.display = "block";
    fetchElement(elements[4]).innerText = `Tries: 10`; //"_".repeat(wordle.info.answer.length) //`____`
    wordle.init(gameStatus.hasStarted);
  }
  setInterval(() => {
    wordle.simulate();
  }, 350);
}, 1e3);