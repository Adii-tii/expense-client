import axios from "axios";
import { serverEndpoint } from "../config/appConfig";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import GroupCardListView from "./GroupCardListView";
import GroupCardGridView from "./GroupCardGridView";

function GroupCard({
  group,
  refreshGroups,
  setMode,
  mode,
  setIsOpen,
  isOpen,
  setCurrentGroup,
  layout
}) {

  const navigate = useNavigate();
  const [showDelete, setShowDelete] = useState(false);

  const MAX_VISIBLE_MEMBERS = 4;

  const members = group.memberEmail || [];
  const visibleMembers = members.slice(0, MAX_VISIBLE_MEMBERS);
  const extraMembers = Math.max(members.length - MAX_VISIBLE_MEMBERS, 0);


  const handleRedirection = () => {
    navigate(`/groups/${group._id}`, { state: { group } });
  };


  const handleDeleteGroup = async () => {
    try {
      await axios.delete(
        `${serverEndpoint}/groups/${group._id}/delete`,
        { withCredentials: true }
      );
      refreshGroups();
    } catch (err) {
      console.log(err);
    }
  };


  const handleEditGroup = (e) => {
    e.stopPropagation();
    setMode("edit");
    setCurrentGroup(group);
    setIsOpen(true);
  };


  const Avatar = ({ email, index }) => (
    <div
      className="rounded-circle d-flex align-items-center justify-content-center fw-semibold"
      style={{
        width: layout === "list" ? "28px" : "32px",
        height: layout === "list" ? "28px" : "32px",
        fontSize: layout === "list" ? "11px" : "12px",
        marginLeft: index === 0 ? 0 : "-8px",
        background: "rgba(157, 92, 255, 0.15)",
        color: "#9D5CFF",
        border: "2px solid #1B1B1D"
      }}
    >
      {email?.[0]?.toUpperCase()}
    </div>
  );

  /* ================= LIST VIEW ================= */

  if (layout === "list") {
    return (
      <GroupCardListView
        handleRedirection={handleRedirection}
        group={group}
        members={members}
        visibleMembers={visibleMembers}
        extraMembers={extraMembers}
        handleEditGroup={handleEditGroup}
        setShowDelete={setShowDelete}
        showDelete={showDelete}
        handleDeleteGroup={handleDeleteGroup}
        Avatar={Avatar} 
      />
    );
  }



  return (
    <GroupCardGridView
      handleRedirection={handleRedirection}
      group={group}
      members={members}
      visibleMembers={visibleMembers}
      extraMembers={extraMembers}
      handleEditGroup={handleEditGroup}
      setShowDelete={setShowDelete}
      showDelete={showDelete}
      handleDeleteGroup={handleDeleteGroup}
      Avatar={Avatar} 
      setIsOpen={setIsOpen}
      isOpen={isOpen}
      mode={mode}
      setMode={setMode}
      setCurrentGroup={setCurrentGroup}
      />
  )

}

export default GroupCard;

