export function prompt(
  message?: string, fallback?: string
): Promise<string | null> {
  if (window === window.parent) { // no iframe
    return Promise.resolve(window.prompt(
      message, fallback
    ));
  }
  return new Promise((resolve) => {
    const html = `<div
      class="modal fade"
      id="bs-prompt-modal"
      tabindex="-1" role="dialog"
    >
      <style>
        .modal .modal-content {
            background-color: var(--xp-gray-dark);
            border-radius: 4px; border: 3px double;
        }
        .modal .modal-content input {
          margin: 0.5em 0 0;
          width: 100%;
        }
        .modal .modal-footer {
            border-color: var(--xp-powered);
            border-top: 1px solid;
        }
      </style>
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <span>${message ?? ''}</span>
            <input
              id="bs-prompt-modal-input"
              value="${fallback ?? ''}"
              type="number">
          </div>
          <div class="modal-footer">
            <div class="btn-group" role="group">
              <button type="button"
                class="btn btn-outline-warning" data-dismiss="modal"
                id="bs-prompt-modal-no">Cancel</button>
              <button type="button"
                class="btn btn-outline-warning"
                id="bs-prompt-modal-ok">OK</button>
            </div>
          </div>
        </div>
      </div>
    </div>`;
    // append modal to body
    document.body.insertAdjacentHTML('beforeend', html);
    const $el = $('#bs-prompt-modal');
    // show modal dialog
    $el.modal('show');
    // handle prompt button click
    $el.find('#bs-prompt-modal-ok').on('click', () => {
      $el.modal('hide');
    });
    $el.find('#bs-prompt-modal-ok').on('click', () => {
      const text = read($('#bs-prompt-modal-input'));
      resolve(text ?? fallback ?? null);
    });
    // handle cancel button click
    $el.find('#bs-prompt-modal-no').on('click', () => {
      $el.modal('hide');
      resolve(null);
    });
    // handle modal close events
    $el.on('hidden.bs.modal', () => {
      $el.remove();
    });
  });
}
function read($el: JQuery<HTMLInputElement>) {
  return typeof $el.val() === 'string' ? $el.val() : null;
}
export default prompt;
