function Footer() {
    return(
    <footer style={{
          padding: "28px 10px 5px",
          textAlign: "center",
          color: "#6b7280",
          lineHeight: 1.8
        }}>
          <p style={{ marginBottom: "6px" }}>
            Made with ❤️ by <strong style={{ color: "#6d28d9" }}>
              Shawaiz
            </strong>
          </p>

          <p style={{ fontSize: "13px", margin: 0 }}>
            © {new Date().getFullYear()} Shawaiz. All rights reserved.
          </p>

          <p style={{ fontSize: "12px", marginTop: "6px" }}>
            Notes App — Built with React, Node.js, Express.js & MongoDB
          </p>
        </footer>
    )
}

export default Footer;