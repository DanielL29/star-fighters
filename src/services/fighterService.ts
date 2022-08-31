import axios from 'axios'

interface Result {
    winner: string | null,
    loser: string | null,
    draw: boolean
}

async function battleService(firstUser: string, secondUser: string) {
    const { data: firstGitUser } = await axios.get(`https://api.github.com/users/${firstUser}/repos`)
    const { data: secondGitUser } = await axios.get(`https://api.github.com/users/${secondUser}/repos`)

    if(firstGitUser.message && firstGitUser === 'Not Found' 
    || secondGitUser.message && secondGitUser === 'Not Found') {
        throw {
            type: 'error_user_not_found',
            message: 'This git hub user was not found'
        }
    }

    const firstUserStarsCount: number = firstGitUser.reduce((cur, prev) => cur + prev.stargazers_count, 0)
    const secondUserStarsCount: number = secondGitUser.reduce((cur, prev) => cur + prev.stargazers_count, 0)

    if(firstUserStarsCount > secondUserStarsCount) {
        return {
            winner: firstUser,
            loser: secondUser,
            draw: false
        }
    } else if(firstUserStarsCount === secondUserStarsCount) {
        return {
            winner: null,
            loser: null,
            draw: true
        }
    } else {
        return {
            winner: secondUser,
            loser: firstUser,
            draw: false
        }
    }
}

export { battleService }