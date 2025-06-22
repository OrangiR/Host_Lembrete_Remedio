
// Sistema de Login e Cadastro - Remedicy
// Integração com JSON Server

const API_BASE_URL = 'http://localhost:3000';
const API_URL = `${API_BASE_URL}/usuarios`;
const LOGIN_URL = "/login.html";
const HOME_URL = "index.html";

// Objeto para o usuário corrente
var usuarioCorrente = {};

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    initLoginApp();
});

function initLoginApp() {
    // Verificar se usuário já está logado
    checkCurrentUser();
    
    // Event listeners para os formulários
    setupEventListeners();
}

function setupEventListeners() {
    // Formulário de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', processLogin);
    }

    // Formulário de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', processRegister);
    }

    // Links para alternar entre login e registro
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', function(e) {
            e.preventDefault();
            showRegisterForm();
        });
    }
    
    if (showLoginLink) {
        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            showLoginForm();
        });
    }
}

function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

function showLoginForm() {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

function processLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    if (!username || !password) {
        showAlert('Por favor, preencha todos os campos.', 'danger');
        return;
    }
    
    loginUser(username, password);
}

function processRegister(event) {
    event.preventDefault();
    
    const nome = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const login = document.getElementById('regLogin').value.trim();
    const senha = document.getElementById('regPassword').value.trim();
    const senha2 = document.getElementById('regPassword2').value.trim();
    
    // Validações
    if (!nome || !email || !login || !senha || !senha2) {
        showAlert('Por favor, preencha todos os campos.', 'danger');
        return;
    }
    
    if (senha !== senha2) {
        showAlert('As senhas não conferem.', 'danger');
        return;
    }
    
    if (senha.length < 3) {
        showAlert('A senha deve ter pelo menos 3 caracteres.', 'danger');
        return;
    }
    
    if (!isValidEmail(email)) {
        showAlert('Por favor, insira um email válido.', 'danger');
        return;
    }
    
    addUser(nome, login, senha, email);
}

function loginUser(login, senha) {
    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao conectar com o servidor');
            }
            return response.json();
        })
        .then(usuarios => {
            const usuario = usuarios.find(u => u.login === login && u.senha === senha);
            
            if (usuario) {
                // Login bem-sucedido
                usuarioCorrente = usuario;
                sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuario));
                
                showAlert('Login realizado com sucesso!', 'success');
                
                setTimeout(() => {
                    window.location.href = HOME_URL;
                }, 1500);
            } else {
                showAlert('Usuário ou senha incorretos.', 'danger');
            }
        })
        .catch(error => {
            console.error('Erro no login:', error);
            showAlert('Erro ao conectar com o servidor. Tente novamente.', 'danger');
        });
}

function addUser(nome, login, senha, email) {
    // Primeiro verificar se o usuário já existe
    fetch(API_URL)
        .then(response => response.json())
        .then(usuarios => {
            const usuarioExistente = usuarios.find(u => u.login === login || u.email === email);
            
            if (usuarioExistente) {
                if (usuarioExistente.login === login) {
                    showAlert('Este nome de usuário já está em uso.', 'danger');
                } else {
                    showAlert('Este email já está cadastrado.', 'danger');
                }
                return;
            }
            
            // Criar novo usuário
            const novoUsuario = {
                nome: nome,
                login: login,
                senha: senha,
                email: email
            };
            
            return fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(novoUsuario),
            });
        })
        .then(response => {
            if (response && response.ok) {
                return response.json();
            } else if (response) {
                throw new Error('Erro ao cadastrar usuário');
            }
        })
        .then(data => {
            if (data) {
                showAlert('Usuário cadastrado com sucesso! Você pode fazer login agora.', 'success');
                
                // Limpar formulário
                document.getElementById('registerForm').reset();
                
                // Voltar para tela de login após 2 segundos
                setTimeout(() => {
                    showLoginForm();
                }, 2000);
            }
        })
        .catch(error => {
            console.error('Erro ao cadastrar usuário:', error);
            showAlert('Erro ao cadastrar usuário. Tente novamente.', 'danger');
        });
}

function checkCurrentUser() {
    const usuario = sessionStorage.getItem('usuarioCorrente');
    if (usuario) {
        try {
            usuarioCorrente = JSON.parse(usuario);
            // Se já está logado e está na página de login, redirecionar para home
            if (window.location.pathname.includes('login.html')) {
                window.location.href = HOME_URL;
            }
        } catch (error) {
            console.error('Erro ao recuperar usuário:', error);
            sessionStorage.removeItem('usuarioCorrente');
        }
    }
}

function logoutUser() {
    sessionStorage.removeItem('usuarioCorrente');
    usuarioCorrente = {};
    window.location.href = "/codigo/public/login.html";
}

function showUserInfo(element) {
    const elemUser = document.getElementById(element);
    if (elemUser && usuarioCorrente.nome) {
        elemUser.innerHTML = `
            <span class="user-info">
                <i class="bi bi-person-circle"></i>
                ${usuarioCorrente.nome} (${usuarioCorrente.login})
                <a onclick="logoutUser()" class="logout-link" title="Sair">
                    <i class="bi bi-box-arrow-right"></i>
                </a>
            </span>
        `;
    }
}

function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `
        <span>${message}</span>
        <button type="button" class="btn-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    alertContainer.appendChild(alertDiv);
    
    // Remover automaticamente após 5 segundos
    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.remove();
        }
    }, 5000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Função para verificar se usuário está logado (para outras páginas)
function getCurrentUser() {
    const usuario = sessionStorage.getItem('usuarioCorrente');
    if (usuario) {
        try {
            return JSON.parse(usuario);
        } catch (error) {
            console.error('Erro ao recuperar usuário:', error);
            sessionStorage.removeItem('usuarioCorrente');
        }
    }
    return null;
}

// Função para proteger páginas que requerem login
function requireLogin() {
    const usuario = getCurrentUser();
    if (!usuario) {
        window.location.href = LOGIN_URL;
        return false;
    }
    usuarioCorrente = usuario;
    return true;
}

// Expor funções globalmente quando necessário
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.showUserInfo = showUserInfo;
window.getCurrentUser = getCurrentUser;
window.requireLogin = requireLogin;
