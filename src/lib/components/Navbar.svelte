<script>
  const menuItems = [
    { name: "Jugar ahora", href: "/jugar" },
    { name: "Cuenta", href: "/cuenta" },
    { name: "Comunidad", href: "/comunidad" },
    { name: "Soporte", href: "/soporte" },
    { name: "Legal y Privacidad", href: "/legal" },
    { name: "Accesibilidad", href: "/accesibilidad" },
    { name: "Tienda", href: "/tienda" },
    { name: "Conócenos", href: "/conocenos" },
  ];
</script>

<nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
  <div class="container-fluid">
    <a class="navbar-brand fw-bold" href="/">Boom Budies</a>

    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#mainMenu"
      aria-controls="mainMenu"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="mainMenu">
      <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
        {#each menuItems as item}
          <li class="nav-item">
            <a class="nav-link" href={item.href}>{item.name}</a>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</nav>

<style>
  .navbar {
    font-size: 1rem;
  }

  .nav-link {
    transition: color 0.3s ease;
  }

  .nav-link:hover {
    color: #ffc107;
  }
</style>
