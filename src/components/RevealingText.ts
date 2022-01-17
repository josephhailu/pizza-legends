export type RevealingTextConfig = {
  element: HTMLElement;
  text: string;
  speed?: number;
};

export default class RevealingText {
  element: HTMLElement;
  text: string;
  speed: number;
  timeout: NodeJS.Timeout | null;
  isDone: boolean;
  constructor(config: RevealingTextConfig) {
    this.element = config.element;
    this.text = config.text;
    this.speed = config.speed || 70;

    this.timeout = null;
    this.isDone = false;
  }

  revealOneCharacter(list: {span: HTMLSpanElement; delayAfter: number}[]) {
    const next = list.splice(0, 1)[0];
    next.span.classList.add("revealed");

    if (list.length > 0) {
      this.timeout = setTimeout(() => {
        this.revealOneCharacter(list);
      }, next.delayAfter);
    } else {
      this.isDone = true;
    }
  }

  warpToDone() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.isDone = true;
      this.element.querySelectorAll("span").forEach((span) => {
        span.classList.add("revealed");
      });
    }
  }

  init() {
    let characters: {span: HTMLSpanElement; delayAfter: number}[] = [];
    this.text.split("").forEach((character) => {
      let span = document.createElement("span");
      span.textContent = character;
      this.element.appendChild(span);

      characters.push({
        span,
        delayAfter: character === " " ? 0 : this.speed,
      });
    });

    this.revealOneCharacter(characters);
  }
}
