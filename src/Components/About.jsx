
import Footer from "./footer";

function About() {
  const features = [
    {
      icon: "🔐",
      title: "User Authentication",
      description:
        "Create an account, log in securely, and manage your account with password change functionality."
    },
    {
      icon: "📝",
      title: "Create & Save Notes",
      description:
        "Create and save your personal notes, thoughts, reminders, important information, and ideas."
    },
    {
      icon: "✏️",
      title: "Edit & Delete Notes",
      description:
        "Update your existing notes or delete the notes you no longer need."
    },
    {
      icon: "🔎",
      title: "Search Notes",
      description:
        "Find your saved notes quickly with the notes search functionality."
    },
    {
      icon: "📩",
      title: "Send Notes to Others",
      description:
        "Share your notes directly with other registered users of iNote Share."
    },
    {
      icon: "📥",
      title: "Receive Notes",
      description:
        "Receive notes from other users and view them in your received notes section."
    },
    {
      icon: "💬",
      title: "Sent & Received History",
      description:
        "View the people you have exchanged notes with and access your sent and received note conversations."
    },
    {
      icon: "🕒",
      title: "Date & Time Tracking",
      description:
        "Check when notes were sent and received, with timestamps available in note history."
    },
    {
      icon: "📧",
      title: "Email Notifications",
      description:
        "Receive email notifications when someone sends you a note, when you log in, and when your password is changed."
    },
    {
      icon: "🌍",
      title: "Access from Anywhere",
      description:
        "Log in from different locations and internet-connected devices to access your saved notes."
    },
    {
      icon: "👤",
      title: "Account Profile",
      description:
        "View and manage your personal account information."
    },
    {
      icon: "📱",
      title: "Responsive Design",
      description:
        "Use iNote Share through a responsive interface on desktops, tablets, and mobile devices."
    }
  ];

  const adminFeatures = [
    {
      icon: "👥",
      title: "User Management",
      description:
        "The admin can view and manage registered user accounts."
    },
    {
      icon: "📊",
      title: "Dashboard & Statistics",
      description:
        "View application statistics and monitor platform activity."
    },
    {
      icon: "📚",
      title: "Notes Monitoring",
      description:
        "Authorized administrators can access and review notes stored on the platform."
    },
    {
      icon: "📩",
      title: "Note Activity",
      description:
        "Monitor note-sharing activity, including sent and received notes."
    },
    {
      icon: "🗂️",
      title: "Admin Note Access",
      description:
        "Administrators can access available stored notes through the admin dashboard."
    },
    {
      icon: "⚙️",
      title: "Platform Management",
      description:
        "Manage users and monitor different sections of the application."
    }
  ];

  const styles = {
    page: {
      minHeight: "100vh",
      padding: "45px 18px",
      background: "linear-gradient(135deg, #f5f3ff, #eef2ff, #faf5ff)",
      color: "#252044",
      fontFamily: "Arial, sans-serif",
      boxSizing: "border-box"
    },
    container: {
      maxWidth: "1050px",
      margin: "0 auto"
    },
    hero: {
      padding: "45px 25px",
      textAlign: "center",
      borderRadius: "25px",
      color: "white",
      background: "linear-gradient(135deg, #2563eb, #4338ca, #312e81)",
      boxShadow: "0 15px 40px rgba(49,46,129,0.2)"
    },
    section: {
      marginTop: "30px",
      padding: "28px",
      background: "white",
      borderRadius: "20px",
      boxShadow: "0 8px 30px rgba(31,41,55,0.06)"
    },
    heading: {
      marginTop: 0,
      color: "#3730a3"
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "18px"
    },
    feature: {
      padding: "22px",
      border: "1px solid #e0e7ff",
      borderRadius: "16px",
      background: "#fcfbff"
    },
    button: {
      display: "inline-block",
      padding: "12px 20px",
      margin: "8px",
      borderRadius: "10px",
      background: "#3730a3",
      color: "white",
      textDecoration: "none",
      fontWeight: "bold"
    }
  };

  const FeatureGrid = ({ items }) => (
    <div style={styles.grid}>
      {items.map((feature) => (
        <article key={feature.title} style={styles.feature}>
          <div style={{ fontSize: "32px" }}>{feature.icon}</div>

          <h3 style={{ marginBottom: "10px", fontSize: "18px" }}>
            {feature.title}
          </h3>

          <p style={{
            color: "#666",
            lineHeight: 1.7,
            marginBottom: 0,
            fontSize: "14px"
          }}>
            {feature.description}
          </p>
        </article>
      ))}
    </div>
  );

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        {/* Hero */}
        <header style={styles.hero}>
          <div style={{ fontSize: "52px" }}>📒</div>

          <h1 style={{
            fontSize: "clamp(30px, 5vw, 46px)",
            margin: "15px 0"
          }}>
            About iNote Share
          </h1>

          <p style={{
            maxWidth: "720px",
            margin: "0 auto",
            fontSize: "17px",
            lineHeight: 1.8,
            color: "#e0e7ff"
          }}>
            Your personal note space and sharing platform.
            Create, save, manage, and share notes with people
            from anywhere, all in one place.
          </p>

          <div style={{
            marginTop: "22px",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "10px"
          }}>
            {["React.js", "Node.js", "Express.js", "MongoDB"].map((tech) => (
              <span
                key={tech}
                style={{
                  padding: "8px 13px",
                  border: "1px solid #c7d2fe",
                  borderRadius: "30px",
                  background: "#ffffff18",
                  fontSize: "13px"
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </header>

        {/* Introduction */}
        <section style={styles.section}>
          <h2 style={styles.heading}>🌟 What is iNote Share?</h2>

          <p style={{ lineHeight: 1.9, color: "#555" }}>
            iNote Share is a web-based note management and sharing
            application designed to make saving and exchanging
            information simple and convenient.
          </p>

          <p style={{ lineHeight: 1.9, color: "#555", marginBottom: 0 }}>
            Users can create their own notes, edit and delete them,
            and share notes directly with other registered users.
            They can also view their sent and received notes,
            check message dates and times, and access their accounts
            from different locations and devices.
          </p>
        </section>

        {/* User Features */}
        <section style={styles.section}>
          <h2 style={styles.heading}>✨ User Features</h2>
          <FeatureGrid items={features} />
        </section>

        {/* Email Notifications */}
        <section style={styles.section}>
          <h2 style={styles.heading}>📧 Email Notifications</h2>

          <p style={{ color: "#555", lineHeight: 1.9 }}>
            iNote Share provides email notifications to help users
            stay informed about important account and note activities.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px"
          }}>
            {[
              ["📩", "New Note", "Get an email notification when someone sends you a note."],
              ["🔑", "Login Activity", "Receive an email notification when you log in."],
              ["🔄", "Password Changed", "Receive an email notification when your account password is changed."]
            ].map(([icon, title, description]) => (
              <div key={title} style={{
                padding: "18px",
                borderRadius: "13px",
                background: "#eff6ff",
                border: "1px solid #dbeafe"
              }}>
                <div style={{ fontSize: "28px" }}>{icon}</div>
                <h3 style={{ color: "#1e40af" }}>{title}</h3>
                <p style={{ color: "#555", lineHeight: 1.7, fontSize: "14px" }}>
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Admin */}
        <section style={styles.section}>
          <h2 style={styles.heading}>🛠️ Admin Dashboard</h2>

          <p style={{ color: "#555", lineHeight: 1.9 }}>
            iNote Share includes an administration dashboard
            that allows authorized administrators to monitor
            and manage different parts of the platform.
          </p>

          <FeatureGrid items={adminFeatures} />
        </section>

        {/* Privacy */}
        <section style={styles.section}>
          <h2 style={styles.heading}>🔎 Privacy & Transparency</h2>

          <div style={{
            padding: "20px",
            borderRadius: "14px",
            background: "#fff7ed",
            borderLeft: "5px solid #ea580c"
          }}>
            <h3 style={{ color: "#9a3412", marginTop: 0 }}>
              ⚠️ Important Security Information
            </h3>

            <p style={{ color: "#7c2d12", lineHeight: 1.9 }}>
              iNote Share does not currently provide end-to-end
              encryption. Notes are stored in the application's
              database and can be accessed by authorized administrators.
              Users should not treat their notes as private from
              the platform administrator.
            </p>

            <p style={{
              color: "#7c2d12",
              lineHeight: 1.9,
              marginBottom: 0
            }}>
              Do not store passwords, financial information,
              confidential documents, or other highly sensitive
              information in notes.
            </p>
          </div>

          <p style={{ color: "#555", lineHeight: 1.9, marginBottom: 0 }}>
            We aim to provide a transparent and convenient
            note-sharing experience while continuing to improve
            application security and account protection.
          </p>
        </section>

        {/* Global Access */}
        <section style={styles.section}>
          <h2 style={styles.heading}>🌍 Access Your Notes Anywhere</h2>

          <div style={{
            padding: "18px",
            borderRadius: "12px",
            background: "#dcfce7",
            borderLeft: "5px solid #16a34a",
            marginBottom: "20px"
          }}>
            <strong>✅ Available Online</strong>
            <p style={{ lineHeight: 1.8, marginBottom: 0 }}>
              Access your account and saved notes from any
              internet-connected device, wherever you are.
            </p>
          </div>

          <p style={{ color: "#555", lineHeight: 1.9 }}>
            Your notes are stored in a MongoDB database, allowing
            you to log in from different devices and locations
            and continue accessing your saved information.
          </p>

          <p style={{ color: "#555", lineHeight: 1.9, marginBottom: 0 }}>
            Whether you are using a desktop, laptop, tablet,
            or mobile device, iNote Share makes your notes
            accessible through its online platform.
          </p>
        </section>

        {/* Technologies */}
        <section style={styles.section}>
          <h2 style={styles.heading}>💻 Technologies Used</h2>

          <FeatureGrid items={[
            {
              icon: "⚛️",
              title: "React.js",
              description: "Used to build the interactive frontend interface."
            },
            {
              icon: "🟢",
              title: "Node.js",
              description: "Powers the backend runtime environment."
            },
            {
              icon: "🚀",
              title: "Express.js",
              description: "Handles backend routes and API requests."
            },
            {
              icon: "🍃",
              title: "MongoDB",
              description: "Stores users, notes, and application data."
            }
          ]} />
        </section>

        {/* Feedback */}
        <section style={{
          ...styles.section,
          textAlign: "center",
          background: "linear-gradient(135deg, #eff6ff, #eef2ff)"
        }}>
          <div style={{ fontSize: "38px" }}>💡</div>

          <h2 style={styles.heading}>Have an Idea or Suggestion?</h2>

          <p style={{
            maxWidth: "650px",
            margin: "0 auto",
            color: "#555",
            lineHeight: 1.8
          }}>
            Have a question, found a problem, or want to suggest
            a new feature? We would love to hear from you.
          </p>

          <div style={{ marginTop: "18px" }}>
            <a href="mailto:shawaizlaiq20@gmail.com" style={styles.button}>
              ✉ Contact Us
            </a>

            <a href="tel:03120002337" style={{
              ...styles.button,
              background: "#fff",
              color: "#3730a3",
              border: "1px solid #c7d2fe"
            }}>
              ☎ Call Us
            </a>
          </div>
        </section>

        {/* Contact */}
        <section style={styles.section}>
          <h2 style={styles.heading}>📩 Contact Information</h2>

          <p style={{ lineHeight: 1.9 }}>
            <strong>Project Owner:</strong> Shawaiz
          </p>

          <p style={{ lineHeight: 1.9 }}>
            <strong>Phone:</strong>{" "}
            <a href="tel:03120002337" style={{ color: "#3730a3" }}>
              03120002337
            </a>
          </p>

          <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
            <strong>Email:</strong>{" "}
            <a
              href="mailto:shawaizlaiq20@gmail.com"
              style={{ color: "#3730a3" }}
            >
              shawaizlaiq20@gmail.com
            </a>
          </p>
        </section>

        <Footer />

      </div>
    </main>
  );
}

export default About;
