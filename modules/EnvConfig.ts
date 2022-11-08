import dotenv from 'dotenv';
dotenv.config();
class InitEnv {
    private port: number | boolean;
    private environment: string;
    private dbName: string;
    private mail: string;
    private passwordMail: string;
    private dbCon: string;
    private jwtAccessToken: string;
    private jwtRefreshToken: string;
    private googleMapApiKey: string;
    constructor() {
        this.environment = process.env.NODE_ENV as string;
        this.port = (this.environment === "development") && (parseInt(process.env.PORT as string, 10));

        this.mail = process.env.MAIL as string;
        this.passwordMail = process.env.MAIl_PASSWORD as string;

        this.googleMapApiKey = process.env.GOOGLE_MAP_KEY as string;

        this.jwtAccessToken = process.env.JWT_ACCESS_TOKEN as string;
        this.jwtRefreshToken = process.env.JWT_REFRESH_TOKEN as string;

        this.dbName = process.env.DB_NAME as string;
        this.dbCon = this.environment === "production" ?
            `mongodb+srv://${process.env.DB_NAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_USERNAME}.ivff6.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
            :
            `mongodb://127.0.0.1:27017/${process.env.DB_NAME}`;
    }
    public getGoogleMapApiKey(): string {
        return this.googleMapApiKey;
    }
    public setGoogleMapApiKey(value: string) {
        this.googleMapApiKey = value;
    }
    public getJwtAccessToken(): string {
        return this.jwtAccessToken;
    }
    public setJwtAccessToken(value: string) {
        this.jwtAccessToken = value;
    }
    public getJwtRefreshToken(): string {
        return this.jwtRefreshToken;
    }
    public setJwtRefreshToken(value: string) {
        this.jwtRefreshToken = value;
    }
    public getPort(): number | boolean {
        return this.port;
    }

    public setPort(port: number | boolean): void {
        this.port = port;
    }

    public getEnvironment(): string {
        return this.environment;
    }

    public setEnvironment(environment: string): void {
        this.environment = environment;
    }

    public getDbName(): string {
        return this.dbName;
    }

    public setDbName(dbName: string): void {
        this.dbName = dbName;
    }

    public getMail(): string {
        return this.mail;
    }

    public setMail(mail: string): void {
        this.mail = mail;
    }

    public getPasswordMail(): string {
        return this.passwordMail;
    }

    public setPasswordMail(passwordMail: string): void {
        this.passwordMail = passwordMail;
    }

    public getDbCon(): string {
        return this.dbCon;
    }

    public setDbCon(dbCon: string): void {
        this.dbCon = dbCon;
    }

    public start() {
        console.log(`mode : ${this.environment} \tport : ${this.port} \tdatabase: ${this.dbName}`);
    }
}
export default new InitEnv();