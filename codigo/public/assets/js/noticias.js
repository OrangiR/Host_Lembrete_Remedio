// API de Notícias de Saúde
class NoticiasAPI {
    constructor() {
        this.apiKey = '568a7cceaa0c4ed7a03e754a0c1a9391';
        this.baseUrl = 'https://newsapi.org/v2/everything';
    }

    async buscarNoticiasSaude() {
        try {
            // Configuração simplificada para buscar mais notícias de saúde em português
            const params = new URLSearchParams({
                q: 'saúde OR medicina OR medicamentos OR remédios',
                language: 'pt',
                sortBy: 'publishedAt',
                pageSize: 20, // Buscar mais notícias para filtrar as válidas
                apiKey: this.apiKey
            });

            const response = await fetch(`${this.baseUrl}?${params}`);

            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status}`);
            }

            const data = await response.json();

            // Filtrar notícias válidas (com título e que não sejam de sites removidos)
            const noticiasValidas = data.articles.filter(noticia => 
                noticia.title && 
                noticia.title !== "[Removed]" &&
                noticia.description &&
                noticia.description !== "[Removed]"
            );

            // Retornar até 6 notícias válidas
            return noticiasValidas.slice(0, 6);
        } catch (error) {
            console.error('Erro ao buscar notícias:', error);
            return this.getNoticiasDefault();
        }
    }

    getNoticiasDefault() {
        // Notícias padrão caso a API falhe
        return [
            {
                title: "Inovações Tecnológicas Revolucionam o Controle de Medicamentos",
                description: "Novos aplicativos e dispositivos inteligentes ajudam pacientes a manterem a rotina de remédios em dia, melhorando significativamente a adesão ao tratamento.",
                urlToImage: "https://p2.trrsf.com/image/fget/cf/1200/630/middle/images.terra.com/2025/06/21/1833171499-0420dba5c0e9e4f2-1400x823-2.jpg",
                url: "#",
                publishedAt: new Date().toISOString()
            },
            {
                title: "Médicos Destacam Importância da Vida Saudável na Prevenção",
                description: "Especialistas enfatizam que hábitos saudáveis, aliados ao uso correto de medicamentos, são fundamentais para a qualidade de vida.",
                urlToImage: "https://s2-valor.glbimg.com/LwLtAvM_Qgqfs3ezigYq_405e_s=/1200x/smart/filters:cover():strip_icc()/i.s3.glbimg.com/v1/AUTH_63b422c2caee4269b8b34177e8876b93/internal_photos/bs/2025/l/U/edfAknRB2gRKeQtHZBEw/foto15pol-101-bolso-a8.jpg",
                url: "#",
                publishedAt: new Date().toISOString()
            },
            {
                title: "Novos Tratamentos Promissores para Doenças Crônicas",
                description: "Pesquisas recentes mostram avanços significativos no desenvolvimento de terapias inovadoras para melhorar a saúde e qualidade de vida.",
                urlToImage: "https://www.infomoney.com.br/wp-content/uploads/2025/06/copy_7E5F69A2-AC0E-41F2-8A08-7D1232012CA6.gif?quality=70",
                url: "#",
                publishedAt: new Date().toISOString()
            },
            {
                title: "Importância do Controle de Horários para Medicamentos",
                description: "Estudos comprovam que seguir rigorosamente os horários de medicação aumenta em 85% a eficácia do tratamento.",
                urlToImage: "https://i0.statig.com.br/bancodeimagens/00/y0/9l/00y09lpco4tk7tj75hgzrunc0.jpg",
                url: "#",
                publishedAt: new Date().toISOString()
            },
            {
                title: "Como Aplicativos de Saúde Estão Transformando o Cuidado Pessoal",
                description: "Ferramentas digitais facilitam o acompanhamento médico e melhoram a comunicação entre pacientes e profissionais de saúde.",
                urlToImage: "https://s1.trrsf.com/update-1698692222/fe/zaz-mod-t360-icons/svg/logos/terra-16x9-borda.png",
                url: "#",
                publishedAt: new Date().toISOString()
            },
            {
                title: "Dicas Essenciais para Não Esquecer de Tomar Remédios",
                description: "Profissionais da saúde compartilham estratégias eficazes para manter a disciplina no uso de medicamentos diários.",
                urlToImage: "https://p2.trrsf.com/image/fget/cf/1200/630/middle/images.terra.com/2025/06/21/1510488736-capa-bons-fluidos-67.png",
                url: "#",
                publishedAt: new Date().toISOString()
            }
        ];
    }

    formatarData(dataISO) {
        const data = new Date(dataISO);
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    truncarTexto(texto, limite = 100) {
        if (!texto) return '';
        return texto.length > limite ? texto.substring(0, limite) + '...' : texto;
    }

    async renderizarNoticias() {
        const container = document.getElementById('noticias-container');
        if (!container) return;

        // Mostrar loading
        container.innerHTML = '<p>Carregando notícias...</p>';

        try {
            const noticias = await this.buscarNoticiasSaude();
            
            if (!noticias || noticias.length === 0) {
                container.innerHTML = '<p>Nenhuma notícia encontrada no momento.</p>';
                return;
            }

            const noticiasHTML = noticias.map(noticia => {
                const imagemUrl = noticia.urlToImage || 'https://via.placeholder.com/300x200/c62828/ffffff?text=Notícia+de+Saúde';
                const titulo = noticia.title || 'Título não disponível';
                const descricao = this.truncarTexto(noticia.description || 'Descrição não disponível', 120);
                const dataPublicacao = this.formatarData(noticia.publishedAt);
                const link = noticia.url;

                // Verificar se o link é válido
                const linkValido = link && link !== '#' && link !== '' && !link.includes('removed');
                const botaoLink = linkValido 
                    ? `<a href="${link}" target="_blank" rel="noopener noreferrer" class="noticia-link">
                         Ler mais <i class="fa-solid fa-external-link-alt"></i>
                       </a>`
                    : `<span class="noticia-link-indisponivel">Link indisponível</span>`;

                return `
                    <article class="noticia-card">
                        <div class="noticia-imagem">
                            <img src="${imagemUrl}" alt="${titulo}" onerror="this.src='https://via.placeholder.com/300x200/c62828/ffffff?text=Saúde'">
                        </div>
                        <div class="noticia-conteudo">
                            <h3 class="noticia-titulo">${titulo}</h3>
                            <p class="noticia-descricao">${descricao}</p>
                            <div class="noticia-footer">
                                <span class="noticia-data">${dataPublicacao}</span>
                                ${botaoLink}
                            </div>
                        </div>
                    </article>
                `;
            }).join('');

            container.innerHTML = noticiasHTML;

        } catch (error) {
            console.error('Erro ao renderizar notícias:', error);
            container.innerHTML = '<p>Erro ao carregar notícias. Tente novamente mais tarde.</p>';
        }
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    const noticiasAPI = new NoticiasAPI();
    noticiasAPI.renderizarNoticias();
});