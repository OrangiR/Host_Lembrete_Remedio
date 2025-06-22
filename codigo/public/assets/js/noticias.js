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
                urlToImage: "https://via.placeholder.com/300x200/c62828/ffffff?text=Tecnologia+na+Saúde",
                url: "#",
                publishedAt: new Date().toISOString()
            },
            {
                title: "Médicos Destacam Importância da Vida Saudável na Prevenção",
                description: "Especialistas enfatizam que hábitos saudáveis, aliados ao uso correto de medicamentos, são fundamentais para a qualidade de vida.",
                urlToImage: "https://via.placeholder.com/300x200/c62828/ffffff?text=Vida+Saudável",
                url: "#",
                publishedAt: new Date().toISOString()
            },
            {
                title: "Novos Tratamentos Promissores para Doenças Crônicas",
                description: "Pesquisas recentes mostram avanços significativos no desenvolvimento de terapias inovadoras para melhorar a saúde e qualidade de vida.",
                urlToImage: "https://via.placeholder.com/300x200/c62828/ffffff?text=Novos+Tratamentos",
                url: "#",
                publishedAt: new Date().toISOString()
            },
            {
                title: "Importância do Controle de Horários para Medicamentos",
                description: "Estudos comprovam que seguir rigorosamente os horários de medicação aumenta em 85% a eficácia do tratamento.",
                urlToImage: "https://via.placeholder.com/300x200/c62828/ffffff?text=Controle+de+Horários",
                url: "#",
                publishedAt: new Date().toISOString()
            },
            {
                title: "Como Aplicativos de Saúde Estão Transformando o Cuidado Pessoal",
                description: "Ferramentas digitais facilitam o acompanhamento médico e melhoram a comunicação entre pacientes e profissionais de saúde.",
                urlToImage: "https://via.placeholder.com/300x200/c62828/ffffff?text=Apps+de+Saúde",
                url: "#",
                publishedAt: new Date().toISOString()
            },
            {
                title: "Dicas Essenciais para Não Esquecer de Tomar Remédios",
                description: "Profissionais da saúde compartilham estratégias eficazes para manter a disciplina no uso de medicamentos diários.",
                urlToImage: "https://via.placeholder.com/300x200/c62828/ffffff?text=Dicas+Remédios",
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