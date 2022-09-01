import connection from "../database/db.js"

export interface User {
    id?: number,
    username: string,
    wins: number,
    losses: number,
    draws: number
}

async function insertUser(user: User): Promise<User> {
    const { username, wins, losses, draws } = user
    console.log(user)

    const userInserted = await connection.query<User, [string, number, number, number]>(
        'INSERT INTO fighters (username, wins, losses, draws) VALUES ($1, $2, $3, $4) RETURNING id, wins, losses, draws', 
    [username, wins, losses, draws])

    return userInserted.rows[0]
}

async function selectUser(username: string): Promise<User> {
    const user = await connection.query<User, [string]>(
        'SELECT id, wins, losses, draws FROM fighters WHERE username = $1', 
    [username])

    return user.rows[0]
}

export type UserUpdate = Omit<User, 'username'>

async function updateUser(id: number, user: UserUpdate) {
    const { wins, losses, draws } = user

    await connection.query<User, [number, number, number, number]>(
        'UPDATE fighters SET wins = $1, losses = $2, draws = $3 WHERE id = $4', 
    [wins, losses, draws, id])
}   

async function selectRanking(): Promise<User[]> {
    const ranking = await connection.query('SELECT username, wins, losses, draws FROM fighters ORDER BY wins DESC, draws DESC')

    return ranking.rows
}

export { insertUser, selectUser, updateUser, selectRanking }