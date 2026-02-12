import DeleteConfirmationModal from "./Modals/DeleteConfirmationModal";

function GroupCardListView(
   {
     handleRedirection,
    group,
    members,
    visibleMembers,
    extraMembers,
    handleEditGroup,
    setShowDelete,
    showDelete,
    handleDeleteGroup,
    Avatar
   }
) {
    return (
        <>
            <div
                className="d-flex align-items-center px-4 py-3 border-bottom"
                style={{ cursor: "pointer" }}
                onClick={handleRedirection}
            >

                <div style={{ flex: 2 }}>
                    <div className="fw-semibold">{group.name}</div>
                    <small style={{ color: "#6B7280" }}>
                        {group.description || "No description"}
                    </small>
                </div>

                <div style={{ flex: 1, color: "#7C6CF2", fontWeight: 500 }}>
                    {members.length} members
                </div>

                <div style={{ flex: 1 }} className="d-flex align-items-center">
                    {visibleMembers.map((m, i) => (
                        <Avatar key={i} email={m} index={i} />
                    ))}

                    {extraMembers > 0 && (
                        <div
                            className="rounded-circle d-flex align-items-center justify-content-center fw-semibold"
                            style={{
                                width: "28px",
                                height: "28px",
                                fontSize: "11px",
                                marginLeft: "-8px",
                                background: "#FFF6D6",
                                color: "#8A6B00",
                                border: "2px solid white"
                            }}
                        >
                            +{extraMembers}
                        </div>
                    )}
                </div>

                {/* MENU */}
                <div style={{ width: "40px" }}>
                    <div className="dropdown">
                        <i
                            className="bi bi-three-dots-vertical"
                            data-bs-toggle="dropdown"
                            onClick={(e) => e.stopPropagation()}
                        />

                        <ul className="dropdown-menu shadow-sm border-0">
                            <li>
                                <button className="dropdown-item" onClick={handleEditGroup}>
                                    Edit
                                </button>
                            </li>

                            <li>
                                <button
                                    className="dropdown-item text-danger"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowDelete(true);
                                    }}
                                >
                                    Delete
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>

            <DeleteConfirmationModal
                show={showDelete}
                setShow={setShowDelete}
                handleDelete={handleDeleteGroup}
            />
        </>
    );
}

export default GroupCardListView;