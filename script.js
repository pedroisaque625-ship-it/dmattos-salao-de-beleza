
    const main = document.getElementById('conteudo');
    const menuCelular = document.querySelector('.mobile-menu');

    // Coloque os caminhos das fotos entre aspas. Exemplo: capa: "fotos/capa.jpg".
    const salao = {
      agendamento: 'https://wa.me/558821561473',
      fotos: {
        capa: '',
        interior: '',
        equipe: '',
        mechas: '',
        maquiagem: '',
        penteados: '',
        penteado: '',
        referencias: '',
        maquiagemEvento: '',
        rotina: '',
        atendimento: '',
        producao: '',
        convite: '',
        equipeContato: ''
      }
    };

    function mostrarFotos() {
      for (const quadro of main.querySelectorAll('[data-foto]')) {
        const chave = quadro.dataset.foto;
        const caminho = salao.fotos[chave];
        if (!caminho) continue;
        const imagem = document.createElement('img');
        imagem.alt = quadro.textContent.trim();
        if (chave !== 'capa') imagem.loading = 'lazy';
        imagem.addEventListener('load', () => quadro.classList.add('photo-fill'), { once: true });
        imagem.addEventListener('error', () => imagem.remove(), { once: true });
        imagem.src = caminho;
        quadro.append(imagem);
      }
    }

    function abrirDetalhe(fragmento) {
      const alvo = document.getElementById(fragmento.slice(1));
      const detalhe = alvo?.closest('.content-details');
      if (!detalhe) return;
      detalhe.open = true;
      return detalhe;
    }

    function mostrarDetalheAtual() {
      abrirDetalhe(location.hash)?.scrollIntoView({ block: 'start' });
    }

    main.addEventListener('click', evento => {
      const link = evento.target.closest('a[href^="#"]');
      if (link) abrirDetalhe(link.hash);
    });

    menuCelular.addEventListener('click', evento => {
      if (evento.target.closest('a')) menuCelular.open = false;
    });
    menuCelular.addEventListener('keydown', evento => {
      if (evento.key !== 'Escape' || !menuCelular.open) return;
      menuCelular.open = false;
      menuCelular.querySelector('summary').focus();
    });

    main.addEventListener('click', evento => {
      const filtro = evento.target.closest('[data-filtro]');
      if (!filtro) return;
      const selecionado = filtro.dataset.filtro;
      for (const botao of main.querySelectorAll('[data-filtro]')) {
        botao.setAttribute('aria-pressed', String(botao === filtro));
      }
      for (const card of main.querySelectorAll('[data-categoria]')) {
        card.hidden = selecionado !== 'Todos' && card.dataset.categoria !== selecionado;
      }
    });

    main.addEventListener('submit', evento => {
      const form = evento.target;
      if (form.id !== 'form-agendamento') return;
      evento.preventDefault();
      const dados = new FormData(form);
      const nome = dados.get('nome').trim();
      if (!nome) {
        const campo = form.elements.nome;
        campo.setCustomValidity('Digita teu nome para continuar.');
        campo.reportValidity();
        campo.addEventListener('input', () => campo.setCustomValidity(''), { once: true });
        return;
      }
      const nomeCompleto = [nome, dados.get('sobrenome').trim()].filter(Boolean).join(' ');
      const mensagem = dados.get('mensagem').trim();
      const texto = [
        'Olá, equipe D’Mattos! Meu nome é ' + nomeCompleto + '.',
        'Quero saber mais sobre: ' + dados.get('servico') + '.',
        mensagem
      ].filter(Boolean).join('\n');
      window.open(salao.agendamento + '?text=' + encodeURIComponent(texto), '_blank', 'noopener,noreferrer');
    });

    main.querySelector('.filters').hidden = false;
    document.getElementById('form-agendamento').hidden = false;
    document.getElementById('contato-direto').hidden = true;
    window.addEventListener('hashchange', mostrarDetalheAtual);
    mostrarFotos();
    mostrarDetalheAtual();
  