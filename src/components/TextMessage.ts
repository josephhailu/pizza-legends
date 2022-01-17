import KeyPressListener from "./KeyPressListener";
import RevealingText from "./RevealingText";

export interface TextMessageParams {
  text: string;
  onComplete: () => void;
}
export default class TextMessage {
  text: string;
  element: HTMLElement | null;
  onComplete: () => void;
  actionListener?: KeyPressListener;
  revealingtext?: RevealingText;
  constructor({text, onComplete}: TextMessageParams) {
    this.text = text;
    this.onComplete = onComplete;
    this.element = null;
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("TextMessage");

    this.element.innerHTML = `
      <p class ="TextMessage_p"></p>
      <button class ="TextMessage_button">Next</button
      `;

    this.revealingtext = new RevealingText({
      element: this.element.querySelector(".TextMessage_p")!,
      text: this.text,
    });

    this.element.querySelector("button")!.addEventListener("click", () => {
      this.done();
    });

    this.actionListener = new KeyPressListener("KeyE", () => {
      this.done();
    });
  }

  done() {
    if (this.revealingtext!.isDone) {
      this.element?.remove();
      this.onComplete();
      this.actionListener!.unbind();
    } else {
      this.revealingtext!.warpToDone();
    }
  }

  init(container: HTMLElement) {
    this.createElement();
    container.appendChild(this.element!);
    this.revealingtext!.init();
  }
}
