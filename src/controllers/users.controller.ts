import { Request, Response, NextFunction } from 'express';

import UsersService from '../services/users.service';

export default class UsersController {
  private userService: UsersService = new UsersService();

  public getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query;
      const { getAllUsers, currentPage, getAllUsersCount, totalCount, totalPages } = await this.userService.findAllUsers(query);

      res.status(200).json({
        data: getAllUsers,
        message: 'findAll',
        currentPage,
        getAllUsersCount,
        totalCount,
        totalPages
      });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const findOneUserData = await this.userService.findUserById(id);

      res.status(200).json({
        data: findOneUserData,
        message: 'findOne'
      });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData = req.body;
      const createUserData = await this.userService.createUser(userData);

      res.status(201).json({
        data: createUserData,
        message: 'created'
      });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userData = req.body;
      const updateUserData = await this.userService.updateUser(id, userData);

      res.status(200).json({
        data: updateUserData,
        message: 'updated'
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const deleteUserData = await this.userService.deleteUser(id);

      res.status(200).json({
        data: deleteUserData,
        message: 'deleted'
      });
    } catch (error) {
      next(error);
    }
  };
}
