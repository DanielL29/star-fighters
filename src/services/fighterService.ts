import axios from 'axios'
import * as fighterRepository from '../repositories/fighterRepository.js'

interface Result {
    winner: string | null,
    loser: string | null,
    draw: boolean
}

interface Startgazers {
    stargazers_count: number
}

interface UsersStars {
    firstUserStarsCount: number 
    secondUserStarsCount: number
}

interface Users {
    firstUserFounded: fighterRepository.UserUpdate
    secondUserFounded: fighterRepository.UserUpdate
}

function calculateStars(firstGitUser: Startgazers[], secondGitUser: Startgazers[]): UsersStars {
    const firstUserStarsCount: number = firstGitUser.reduce((cur, prev) => cur + prev.stargazers_count, 0)
    const secondUserStarsCount: number = secondGitUser.reduce((cur, prev) => cur + prev.stargazers_count, 0)

    return { firstUserStarsCount, secondUserStarsCount }
}

async function foundUsersOrInsert(firstUser: string, secondUser: string): Promise<Users> {
    const findFirstUser = await fighterRepository.selectUser(firstUser)
    const findSecondUser = await fighterRepository.selectUser(secondUser)
    let firstUserFounded = findFirstUser
    let secondUserFounded = findSecondUser

    const user: fighterRepository.User = {
        username: '',
        wins: 0,
        losses: 0,
        draws: 0 
    }

    if(!findFirstUser) {
        user.username = firstUser
        firstUserFounded = await fighterRepository.insertUser(user)
    } 
    
    if(!findSecondUser) {
        user.username = secondUser
        secondUserFounded = await fighterRepository.insertUser(user)
    }

    return { firstUserFounded, secondUserFounded }
}

async function finishBattle(
    firstUserStarsCount: number, 
    secondUserStarsCount: number, 
    firstUserFounded: fighterRepository.UserUpdate, 
    secondUserFounded: fighterRepository.UserUpdate, 
    firstUser: string, secondUser: string
): Promise<Result> {
    if(firstUserStarsCount > secondUserStarsCount) {
        firstUserFounded.wins++
        secondUserFounded.losses++

        await fighterRepository.updateUser(firstUserFounded.id, firstUserFounded)
        await fighterRepository.updateUser(secondUserFounded.id, secondUserFounded)

        return {
            winner: firstUser,
            loser: secondUser,
            draw: false
        }
    } else if(firstUserStarsCount === secondUserStarsCount) {
        firstUserFounded.draws++
        secondUserFounded.draws++

        await fighterRepository.updateUser(firstUserFounded.id, firstUserFounded)
        await fighterRepository.updateUser(secondUserFounded.id, secondUserFounded)

        return {
            winner: null,
            loser: null,
            draw: true
        }
    } else {
        secondUserFounded.wins++
        firstUserFounded.losses++

        await fighterRepository.updateUser(firstUserFounded.id, firstUserFounded)
        await fighterRepository.updateUser(secondUserFounded.id, secondUserFounded)

        return {
            winner: secondUser,
            loser: firstUser,
            draw: false
        }
    }
}

async function battleService(firstUser: string, secondUser: string): Promise<Result> {
    const { data: firstGitUser } = await axios.get(`https://api.github.com/users/${firstUser}/repos`)
    const { data: secondGitUser } = await axios.get(`https://api.github.com/users/${secondUser}/repos`)

    if(firstGitUser.message && firstGitUser === 'Not Found' 
    || secondGitUser.message && secondGitUser === 'Not Found') {
        throw {
            type: 'error_user_not_found',
            message: 'This git hub user was not found'
        }
    }

    const { firstUserStarsCount, secondUserStarsCount } = calculateStars(firstGitUser, secondGitUser)

    const { firstUserFounded, secondUserFounded } = await foundUsersOrInsert(firstUser, secondUser)

    return finishBattle(firstUserStarsCount, secondUserStarsCount, firstUserFounded, secondUserFounded, firstUser, secondUser)
}

async function rankingService() {
    const ranking = await fighterRepository.selectRanking()

    return ranking
}

export { battleService, rankingService }