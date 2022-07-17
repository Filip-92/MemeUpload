export interface ResetPasswordDto {
    password: string;
    confirmPassword: string;
    userId: string;
    token: string;
}