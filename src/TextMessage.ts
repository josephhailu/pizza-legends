interface TextMessageParams {
  text: string;
  onComplete: () => void;
}
class TextMessage {
  text: string;
  element: HTMLElement | null;
  onComplete: () => void;
  actionListener?: KeyPressListener;
  constructor({text, onComplete}: TextMessageParams) {
    this.text = text;
    this.onComplete = onComplete;
    this.element = null;
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("TextMessage");

    this.element.innerHTML = `
      <p class ="TextMessage_p">${this.text}</p>
      <button class ="TextMessage_button">Next</button
      `;

    this.element.querySelector("button")!.addEventListener("click", () => {
      this.done();
    });

    this.actionListener = new KeyPressListener("KeyE", () => {
      this.actionListener!.unbind();
      this.done();
    });
  }
  done() {
    this.element?.remove();
    this.onComplete();
  }

  init(container: HTMLElement) {
    this.createElement();
    container.appendChild(this.element!);
  }
}