const BASE_URL = 'https://api.github.com';
const inputSearch = document.getElementById('input-search');
const btnSearch = document.getElementById('btn-search');
const profileResults = document.querySelector('.profile-results');

async function fetchUserProfile(userName) {
    const response = await fetch(`${BASE_URL}/users/${userName}`);
    if (!response.ok) {
        throw new Error('Usuário não encontrado.');
    }
    return await response.json();
}

async function fetchUserRepositories(userName) {
    const response = await fetch(`${BASE_URL}/users/${userName}/repos`);
    if (!response.ok) {
        throw new Error('Erro ao buscar os repositórios do usuário.');
    }
    return await response.json();
}

function renderProfile(userData) {
    profileResults.innerHTML = `
        <div class="profile-card">
            <img src="${userData.avatar_url}" alt="Avatar de ${userData.name}" class="profile-avatar">
            <div class="profile-info">
                <h2>${userData.name}</h2>
                <p>${userData.bio || 'Não possui bio cadastrada 😢.'}</p>
            </div>
        </div>
        <div class="profile-counters">
            <div class="followers">
                <h4>👥 Seguidores</h4>
                <span>${userData.followers}</span>
            </div>
            <div class="following">
                <h4>👥 Seguindo</h4>
                <span>${userData.following}</span>
            </div>
        </div>
    `;
}

function renderRepositories(repos) {
    const reposList = repos.map(repo => `
        <li>
            <a href="${repo.html_url}" target="_blank">
                <h3 class="repo-name">${repo.name}</h3>
                <p class="repo-description">${repo.description || 'Sem descrição'}</p>
                <div class="repo-details">
                    <span class="repo-language">${repo.language || 'Não especificada'}</span>
                    <span class="repo-stars">⭐ ${repo.stargazers_count}</span>
                </div>
            </a>
        </li>
    `).join('');

    profileResults.innerHTML += `
        <div class="repositories">
            <h3>Repositórios</h3>
            <ul>${reposList}</ul>
        </div>
    `;
}

btnSearch.addEventListener('click', async () => {
    const userName = inputSearch.value.trim();

    if (userName) {
        profileResults.innerHTML = `<p class="loading">Carregando...</p>`;
        try {
            const userData = await fetchUserProfile(userName);
            const repos = await fetchUserRepositories(userName);

            renderProfile(userData);
            renderRepositories(repos);

        } catch (error) {
            profileResults.innerHTML = `<p class="error">${error.message}</p>`;
        }
    } else {
        profileResults.innerHTML = `<p class="error">Por favor, digite um nome de usuário do GitHub.</p>`;
    }
});
