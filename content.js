// Moodle Quiz Keyboard Navigator

class MoodleQuizNavigator {
  constructor() {
    this.currentQuestionIndex = 0;
    this.questions = [];
    this.isActive = false;
    this.init();
  }

  init() {
    // ページが読み込まれたら初期化
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    // Moodleクイズページかどうかを確認
    if (!this.isMoodleQuizPage()) {
      return;
    }

    this.findQuestions();
    this.addKeyboardListener();
    this.addVisualIndicators();
    this.isActive = true;
  }

  isMoodleQuizPage() {
    // Moodleクイズページの判定
    const url = window.location.href;
    return (
      url.includes("moodle.s.kyushu-u.ac.jp") &&
      (url.includes("/mod/quiz/") ||
        document.querySelector(".que") !== null ||
        document.querySelector('[id^="question-"]') !== null)
    );
  }

  findQuestions() {
    // main.tsのロジックを参考に問題を取得
    this.questions = [];

    // レビューページの場合
    const reviewQuestions = document.querySelectorAll(
      '[id^="question-"][id*="-"]',
    );
    if (reviewQuestions.length > 0) {
      reviewQuestions.forEach((questionEl, index) => {
        this.questions.push({
          element: questionEl,
          index: index,
          type: "review",
        });
      });
      return;
    }

    // 通常のクイズページの場合
    const quizQuestions = document.querySelectorAll(".que");
    if (quizQuestions.length > 0) {
      quizQuestions.forEach((questionEl, index) => {
        this.questions.push({
          element: questionEl,
          index: index,
          type: "quiz",
        });
      });
      return;
    }

    // 単一問題ページの場合
    const singleQuestion =
      document.querySelector(".questiontext") ||
      document.querySelector(".qtext");
    if (singleQuestion) {
      const questionContainer =
        singleQuestion.closest(".que") ||
        singleQuestion.closest('[class*="question"]') ||
        document.body;
      this.questions.push({
        element: questionContainer,
        index: 0,
        type: "single",
      });
    }
  }

  addKeyboardListener() {
    document.addEventListener("keydown", (event) => {
      if (!this.isActive) return;

      // 入力フィールドにフォーカスがある場合は無視
      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
      ) {
        return;
      }

      const key = event.key;

      // 1-4キーで選択肢を選択
      if (["1", "2", "3", "4"].includes(key)) {
        event.preventDefault();
        this.selectChoice(parseInt(key) - 1);
      }

      // 矢印キーで問題間移動（複数問題がある場合）
      else if (key === "ArrowDown" || key === "ArrowRight") {
        event.preventDefault();
        this.nextQuestion();
      } else if (key === "ArrowUp" || key === "ArrowLeft") {
        event.preventDefault();
        this.previousQuestion();
      }

      // Enterキーで次の問題または送信
      else if (key === "Enter") {
        event.preventDefault();
        this.handleEnter();
      }
    });
  }

  selectChoice(choiceIndex) {
    const currentQuestion = this.questions[this.currentQuestionIndex];
    if (!currentQuestion) return;

    const questionEl = currentQuestion.element;

    let choices = [];

    // パターン1: input[type="radio"]
    const radioInputs = questionEl.querySelectorAll('input[type="radio"]');
    if (radioInputs.length > 0) {
      choices = Array.from(radioInputs);
    }

    // パターン2: input[type="checkbox"]（複数選択）
    if (choices.length === 0) {
      const checkboxInputs = questionEl.querySelectorAll(
        'input[type="checkbox"]',
      );
      if (checkboxInputs.length > 0) {
        choices = Array.from(checkboxInputs);
      }
    }

    // パターン3: .flex-fill.ml-1（main.tsで使用されているセレクタ）
    if (choices.length === 0) {
      const flexChoices = questionEl.querySelectorAll(".flex-fill.ml-1");
      if (flexChoices.length > 0) {
        // この場合、対応するinputを探す
        flexChoices.forEach((choice) => {
          const input =
            choice.querySelector("input") ||
            choice.closest(".answer").querySelector("input");
          if (input) choices.push(input);
        });
      }
    }

    if (choiceIndex >= 0 && choiceIndex < choices.length) {
      const targetChoice = choices[choiceIndex];

      // ラジオボタンの場合は選択
      if (targetChoice.type === "radio") {
        targetChoice.checked = true;
        targetChoice.dispatchEvent(new Event("change", { bubbles: true }));
      }
      // チェックボックスの場合はトグル
      else if (targetChoice.type === "checkbox") {
        targetChoice.checked = !targetChoice.checked;
        targetChoice.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
  }

  nextQuestion() {
    if (this.questions.length <= 1) return;

    this.currentQuestionIndex =
      (this.currentQuestionIndex + 1) % this.questions.length;
    this.scrollToCurrentQuestion();
    // this.showTemporaryFeedback(
    //   `問題 ${this.currentQuestionIndex + 1}/${this.questions.length}`,
    // );
  }

  previousQuestion() {
    if (this.questions.length <= 1) return;

    this.currentQuestionIndex =
      this.currentQuestionIndex === 0
        ? this.questions.length - 1
        : this.currentQuestionIndex - 1;
    this.scrollToCurrentQuestion();
    // this.showTemporaryFeedback(
    //   `問題 ${this.currentQuestionIndex + 1}/${this.questions.length}`,
    // );
  }

  scrollToCurrentQuestion() {
    const currentQuestion = this.questions[this.currentQuestionIndex];
    if (currentQuestion) {
      currentQuestion.element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      // 現在の問題をハイライト
      document.querySelectorAll(".current-question-highlight").forEach((el) => {
        el.classList.remove("current-question-highlight");
      });
      currentQuestion.element.classList.add("current-question-highlight");
    }
  }

  handleEnter() {
    const submitSelectors = [
      "#mod_quiz-next-nav", // ID指定（最も確実）
      'input[name="next"]', // name属性指定
      'input[value="次のページ"]', // value属性指定
      ".mod_quiz-next-nav", // class指定
      // 'input[type="submit"][value*="次"]', // より一般的なパターン
      'button[value*="次のページ"]', // 従来のパターンも保持
    ];

    let submitButton = null;
    for (const selector of submitSelectors) {
      submitButton = document.querySelector(selector);
      if (submitButton) {
        break;
      }
    }

    if (submitButton) {
      submitButton.click();
    } else if (this.questions.length > 1) {
      this.nextQuestion();
    }
    // } else {
    //   // 単一問題の場合、次のページへのリンクを探す
    //   const nextLink =
    //     // document.querySelector('a[href*="page="]:contains("次")') ||
    //     document.querySelector('a[href*="page="]') ||
    //     document.querySelector('.singlebutton input[type="submit"]');

    //   if (nextLink) {
    //     nextLink.click();
    //     this.showTemporaryFeedback("次のページへ");
    //   } else {
    //     this.showTemporaryFeedback("送信ボタンが見つかりません");
    //   }
    // }
  }

  addVisualIndicators() {
    // 現在の問題にインジケーターを追加
    if (this.questions.length > 0) {
      this.scrollToCurrentQuestion();
    }
  }

  showTemporaryFeedback(message) {
    // 既存のフィードバックを削除
    const existing = document.getElementById("temp-feedback");
    if (existing) existing.remove();

    const feedback = document.createElement("div");
    feedback.id = "temp-feedback";
    feedback.className = "temp-feedback";
    feedback.textContent = message;

    document.body.appendChild(feedback);

    setTimeout(() => {
      if (feedback.parentElement) {
        feedback.remove();
      }
    }, 1500);
  }
}

// 拡張機能を初期化
const navigator = new MoodleQuizNavigator();
