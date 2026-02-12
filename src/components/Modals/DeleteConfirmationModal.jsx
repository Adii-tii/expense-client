function DeleteConfirmationModal({ handleDelete, show, setShow }) {

  if (!show) return null;

  return (
    <>
      {/* BACKDROP */}
      <div
        className="modal show d-block"
        style={{ background: "rgba(0,0,0,0.45)" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4 border-0 shadow">

            {/* HEADER */}
            <div className="modal-header border-0">
              <h5 className="modal-title fw-semibold">
                Delete Group
              </h5>

              <button
                type="button"
                className="btn-close"
                onClick={() => setShow(false)}
              />
            </div>

            {/* BODY */}
            <div className="modal-body pt-0">
              <p className="mb-0">
                Are you sure you want to delete this group?  
                This action cannot be undone.
              </p>
            </div>

            {/* FOOTER */}
            <div className="modal-footer border-0">

              <button
                className="btn btn-outline-secondary"
                onClick={() => setShow(false)}
              >
                Cancel
              </button>

              <button
                className="btn btn-danger"
                onClick={() => {
                  handleDelete();
                  setShow(false);
                }}
              >
                Delete
              </button>

            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default DeleteConfirmationModal;
