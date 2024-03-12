function alertmove(path, token) {
    return `<script>
              localStorage.setItem('token',${JSON.stringify(token)});
              document.location.href = "${path}"
              </script>`;
}

module.exports = alertmove;
