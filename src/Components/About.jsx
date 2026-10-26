import Footer from "./footer";

function About() {
  const features = [
    {
      icon: "🔐",
      title: "User Authentication",
      description:
        "Create an account and log in to access your personal notes."
    },
    {
      icon: "📝",
      title: "Create Notes",
      description:
        "Save your thoughts, important information, reminders, and ideas."
    },
    {
      icon: "✏️",
      title: "Edit Notes",
      description:
        "Update your existing notes whenever you need to."
    },
    {
      icon: "🗑️",
      title: "Delete Notes",
      description:
        "Remove notes you no longer need with ease."
    },
    {
      icon: "🔎",
      title: "Search Notes",
      description:
        "Find specific notes quickly without searching manually."
    },
    {
      icon: "👤",
      title: "Account Profile",
      description:
        "View your profile and personal account information."
    },
    {
      icon: "📱",
      title: "Responsive Design",
      description:
        "Enjoy a user-friendly interface on different screen sizes."
    },
    {
      icon: "💾",
      title: "Database Integration",
      description:
        "The backend connects with MongoDB to manage your notes."
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
      background: "linear-gradient(135deg, #7c3aed, #4c1d95, #312e81)",
      boxShadow: "0 15px 40px rgba(76,29,149,0.2)"
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
      color: "#5b21b6"
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "18px"
    },
    feature: {
      padding: "22px",
      border: "1px solid #ede9fe",
      borderRadius: "16px",
      background: "#fcfbff"
    },
    button: {
      display: "inline-block",
      padding: "12px 20px",
      margin: "8px",
      borderRadius: "10px",
      background: "#6d28d9",
      color: "white",
      textDecoration: "none",
      fontWeight: "bold"
    }
  };

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        {/* Hero Section */}
        <header style={styles.hero}>
          <div style={{ fontSize: "48px" }}>📒</div>

          <h1 style={{ fontSize: "clamp(30px, 5vw, 46px)", margin: "15px 0" }}>
            About Our Notes App
          </h1>

          <p style={{
            maxWidth: "700px",
            margin: "0 auto",
            fontSize: "17px",
            lineHeight: 1.8,
            color: "#ede9fe"
          }}>
            Organize your thoughts, save important information, and
            manage your notes in one simple and convenient place.
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
                  border: "1px solid #c4b5fd",
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
          <h2 style={styles.heading}>🌟 Who We Are</h2>

          <p style={{ lineHeight: 1.9, color: "#555" }}>
            Welcome to our Notes App! This project was created to make
            note-taking simple, accessible, and organized. Whether you
            want to save ideas, write reminders, or keep important
            information, our goal is to give you a convenient place
            to manage your notes.
          </p>

          <p style={{ lineHeight: 1.9, color: "#555", marginBottom: 0 }}>
            The application is built using modern web technologies,
            with a React frontend and a Node.js/Express backend
            connected to MongoDB.
          </p>
        </section>

        {/* Features */}
        <section style={styles.section}>
          <h2 style={styles.heading}>✨ Key Features</h2>

          <div style={styles.grid}>
            {features.map((feature) => (
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
        </section>

        {/* Project Status */}
<section style={styles.section}>
  <h2 style={styles.heading}>
    🌍 Global Access & Project Status
  </h2>

  <div
    style={{
      padding: "18px",
      borderRadius: "12px",
      background: "#dcfce7",
      borderLeft: "5px solid #16a34a",
      marginBottom: "20px"
    }}
  >
    <strong>✅ Status: Available Online</strong>
    <p style={{ lineHeight: 1.8, marginBottom: 0 }}>
      iNotebook is now available online, allowing users to
      access their personal notes from anywhere in the world.
      The application is designed to make note-taking simple,
      convenient, and accessible across locations.
    </p>
  </div>

  <p style={{ color: "#555", lineHeight: 1.9 }}>
    With iNotebook, you can create new notes, view your saved
    notes, edit existing notes, and manage your personal
    information whenever you need it. Your notes are stored
    in a MongoDB database and can be accessed after logging
    in to your account from an internet-connected device.
  </p>

  <p style={{ color: "#555", lineHeight: 1.9 }}>
    Our goal is to provide a convenient and reliable
    note-taking experience for users worldwide. We will
    continue improving the application's performance,
    usability, security, and features to make managing notes
    even easier.
  </p>
</section>

        {/* Feedback */}
        <section style={{
          ...styles.section,
          textAlign: "center",
          background: "linear-gradient(135deg, #f5f3ff, #faf5ff)"
        }}>
          <div style={{ fontSize: "38px" }}>💡</div>

          <h2 style={styles.heading}>Have an Idea or Suggestion?</h2>

          <p style={{
            maxWidth: "650px",
            margin: "0 auto",
            color: "#555",
            lineHeight: 1.8
          }}>
            Found a problem, need help using the app, or have an idea
            for a new feature? We would love to hear from you.
            Feel free to contact us with your questions and suggestions.
          </p>

          <div style={{ marginTop: "18px" }}>
            <a href="mailto:shawaizlaiq20@gmail.com" style={styles.button}>
              ✉ Contact Us
            </a>

            <a href="tel:03120002337" style={{
              ...styles.button,
              background: "#fff",
              color: "#6d28d9",
              border: "1px solid #c4b5fd"
            }}>
              ☎ Call Us
            </a>
          </div>
        </section>

        {/* Contact Details */}
        <section style={styles.section}>
          <h2 style={styles.heading}>📩 Contact Information</h2>

          <p style={{ lineHeight: 1.9 }}>
            <strong>Project Owner:</strong> Shawaiz
          </p>

          <p style={{ lineHeight: 1.9 }}>
            <strong>Phone:</strong>{" "}
            <a href="tel:03120002337" style={{ color: "#6d28d9" }}>
              03120002337
            </a>
          </p>

          <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
            <strong>Email:</strong>{" "}
            <a
              href="mailto:shawaizlaiq20@gmail.com"
              style={{ color: "#6d28d9" }}
            >
              shawaizlaiq20@gmail.com
            </a>
          </p>
        </section>

        {/* Footer */}
        <Footer/>

      </div>
    </main>
  );
}

export default About;