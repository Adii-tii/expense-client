import DeleteConfirmationModal from "./Modals/DeleteConfirmationModal";
import CreateGroupModal from "./Modals/CreateGroupModal";

function GroupCardGridView({
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
}) {

    if (!group) return null;

    return (
        <>
            <div
                className="card border-0 rounded-4 overflow-hidden h-100"
                style={{
                    background: "#1B1B1D",
                    boxShadow: "none",
                    cursor: "pointer"
                }}
                onClick={handleRedirection}
            >

                {/* THUMBNAIL */}
                <div
                    className="position-relative"
                    style={{
                        height: "140px",
                        backgroundImage: `url(${group.thumbnail || "https://i.pinimg.com/1200x/59/af/ea/59afeaf0ae313151172536ca557afe01.jpg"})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                    }}
                >

                    <div
                        className="position-absolute top-0 start-0 w-100 h-100"
                        style={{
                            background:
                                "linear-gradient(to top, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.08))"
                        }}
                    />

                    <div className="position-absolute bottom-0 start-0 w-100 p-3 text-white">
                        <div className="d-flex justify-content-between align-items-center">

                            <h5 className="fw-semibold mb-0">{group.name}</h5>

                            <div className="dropdown">
                                <i
                                    className="bi bi-three-dots-vertical"
                                    data-bs-toggle="dropdown"
                                    onClick={(e) => e.stopPropagation()}
                                />

                                <ul className="dropdown-menu shadow-sm border-0">
                                    <li>
                                        <button
                                            className="dropdown-item"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditGroup(e);
                                            }}
                                        >
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
                </div>

                {/* BODY */}
                <div className="card-body d-flex flex-column justify-content-between">

                    {group.description && (
                        <p className="small mb-3" style={{ color: "#A1A1AA" }}>
                            {group.description}
                        </p>
                    )}

                    <div className="d-flex align-items-center justify-content-between mt-auto">

                        <div className="d-flex align-items-center">
                            {visibleMembers.map((m, i) => (
                                <Avatar key={i} email={m} index={i} />
                            ))}

                            {extraMembers > 0 && (
                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center fw-semibold"
                                    style={{
                                        width: "32px",
                                        height: "32px",
                                        fontSize: "12px",
                                        marginLeft: "-8px",
                                        background: "rgba(255, 215, 0, 0.15)",
                                        color: "#FFD700"
                                    }}
                                >
                                    +{extraMembers}
                                </div>
                            )}
                        </div>

                        <small style={{ color: "#A1A1AA" }}>
                            {members.length} members
                        </small>

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

export default GroupCardGridView;
