export interface UserType {
    name: string,
    email: string, 
    image: string,
    password?: string,
}

export interface InitialState {
  user: UserType
  userWindow: boolean
};
