export function confirm(
  message?: string
): Promise<boolean> {
  if (window === window.parent) { // no iframe
    return Promise.resolve(window.confirm(message));
  }
  return new Promise((resolve) => {
    const html = `<div
      class="modal fade"
      id="bs-confirm-modal"
      tabindex="-1" role="dialog"
    >
      <style>
        .modal .modal-content {
            background-color: var(--xp-gray-dark);
            border-radius: 4px; border: 3px double;
        }
        .modal .modal-footer {
            border-color: var(--xp-powered);
            border-top: 1px solid;
        }
      </style>
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-body">${message ?? ''}</div>
          <div class="modal-footer">
            <div class="btn-group" role="group">
              <button type="button"
                class="btn btn-outline-warning" data-dismiss="modal"
                id="bs-confirm-modal-no">Cancel</button>
              <button type="button"
                class="btn btn-outline-warning"
                id="bs-confirm-modal-ok">OK</button>
            </div>
          </div>
        </div>
      </div>
    </div>`;
    // append modal to body
    document.body.insertAdjacentHTML('beforeend', html);
    const $el = $('#bs-confirm-modal');
    // show modal dialog
    $el.modal('show');
    // handle confirm button click
    $el.find('#bs-confirm-modal-ok').on('click', () => {
      $el.modal('hide');
      resolve(true);
    });
    // handle cancel button click
    $el.find('#bs-confirm-modal-no').on('click', () => {
      $el.modal('hide');
      resolve(false);
    });
    // handle modal close events
    $el.on('hidden.bs.modal', () => {
      $el.remove();
    });
  });
}
export default confirm;
