import theme from "../theme/colors";
import { serverEndpoint } from "../config/appConfig";
import { useState, useEffect } from "react";
import axios from "axios";
import { BeatLoader } from "react-spinners";

const placeholderAvatar =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

function Profile() {
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [userProfile, setUserProfile] = useState(null);

  const getUserProfile = async () => {
    try {
      const res = await axios.get(
        `${serverEndpoint}/profile/get-user-info`,
        { withCredentials: true }
      );
      setUserProfile(res?.data?.user);
    } catch {
      setErrors({ message: "Unable to fetch user profile. Try again later." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: theme.BG_LIGHT
        }}
      >
        <BeatLoader color={theme.PRIMARY} size={14} />
      </div>
    );
  }

  if (errors.message) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: theme.BG_LIGHT,
          color: theme.DANGER
        }}
      >
        {errors.message}
      </div>
    );
  }

  return (
    <div
      style={{
        background: "transparent",
        padding: "0"
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          gap: 32
        }}
      >
        {/* LEFT SIDEBAR */}
        <div>
          <div
            style={{
              background: theme.BG_WHITE,
              borderRadius: theme.RADIUS_LG,
              padding: 24,
              boxShadow: theme.SHADOW_SM,
              textAlign: "center"
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 160,
                height: 160,
                borderRadius: "50%",
                margin: "0 auto 16px",
                overflow: "hidden",
                border: `6px solid ${theme.PRIMARY_SOFT}`,
                background: theme.BG_SOFT
              }}
            >
              <img
                src={userProfile?.avatar || placeholderAvatar}
                alt="avatar"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
            </div>

            {/* Name */}
            <h2
              style={{
                margin: 0,
                color: theme.TEXT_MAIN,
                fontWeight: 600
              }}
            >
              {userProfile?.name || "Unnamed User"}
            </h2>

            {/* Email */}
            <div
              style={{
                color: theme.TEXT_MUTED,
                fontSize: 14,
                marginBottom: 20
              }}
            >
              {userProfile?.email}
            </div>

            {/* Edit */}
            <button
              style={{
                width: "100%",
                padding: "10px 0",
                borderRadius: theme.RADIUS_PILL,
                border: `1px solid ${theme.BORDER}`,
                background: theme.BG_WHITE,
                color: theme.TEXT_MAIN,
                fontWeight: 500,
                cursor: "pointer"
              }}
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div style={{ display: "grid", gap: 24 }}>
          {/* Account Info */}
          <Section title="Account Information">
            <InfoRow label="User ID" value={userProfile?._id} />
            <InfoRow label="Email" value={userProfile?.email} />
            <InfoRow label="Joined" value={formatDate(userProfile?.createdAt)} />
          </Section>

          {/* Activity Stats */}
          <Section title="Activity">
            <StatsGrid>
              <Stat label="Groups" value={userProfile?.groups?.length || 0} />
              <Stat label="Expenses" value={userProfile?.expenses?.length || 0} />
              <Stat label="Settlements" value={0} />
            </StatsGrid>
          </Section>

          {/* Preferences */}
          <Section title="Preferences">
            <InfoRow label="Currency" value={userProfile?.currency || "INR"} />
            <InfoRow label="Language" value="English" />
          </Section>
        </div>
      </div>
    </div>
  );
}

/* ---------- UI COMPONENTS ---------- */

function Section({ title, children }) {
  return (
    <div
      style={{
        background: theme.BG_WHITE,
        borderRadius: theme.RADIUS_LG,
        padding: 24,
        boxShadow: theme.SHADOW_SM
      }}
    >
      <h3
        style={{
          marginTop: 0,
          marginBottom: 16,
          fontSize: 16,
          color: theme.TEXT_MAIN
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 0",
        borderBottom: `1px solid ${theme.BORDER}`,
        fontSize: 14
      }}
    >
      <span style={{ color: theme.TEXT_MUTED }}>{label}</span>
      <span style={{ color: theme.TEXT_MAIN }}>{value || "—"}</span>
    </div>
  );
}

function StatsGrid({ children }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))",
        gap: 16
      }}
    >
      {children}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div
      style={{
        background: theme.BG_SOFT,
        borderRadius: theme.RADIUS_MD,
        padding: 16,
        textAlign: "center"
      }}
    >
      <div
        style={{
          fontSize: 22,
          fontWeight: 600,
          color: theme.TEXT_MAIN
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 13,
          color: theme.TEXT_MUTED
        }}
      >
        {label}
      </div>
    </div>
  );
}

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString();
}

export default Profile;
