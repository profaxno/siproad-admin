import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, HttpCode, HttpStatus, Query, ParseUUIDPipe, ParseArrayPipe, NotFoundException } from '@nestjs/common';

import { PaginationDto } from 'src/common/dto/pagination.dto'; 
import { SearchDto } from 'src/common/dto/search.dto';

import { UserDto } from './dto/user.dto';
import { AdminResponseDto } from './dto/admin-response-dto';
import { UserService } from './user.service';
import { AlreadyExistException, IsBeingUsedException } from './exceptions/admin.exception';


@Controller('siproad-products')
export class UserController {

  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly userService: UserService
  ) {}

  @Patch('/users/update')
  @HttpCode(HttpStatus.OK)
  updateUser(@Body() dto: UserDto): Promise<AdminResponseDto> {
    this.logger.log(`>>> updateUser: dto=${JSON.stringify(dto)}`);
    const start = performance.now();

    return this.userService.updateUser(dto)
    .then( (dto: UserDto) => {
      const response = new AdminResponseDto(HttpStatus.OK, 'created/updated', [dto]);
      const end = performance.now();
      this.logger.log(`<<< updateUser: executed, runtime=${(end - start) / 1000} seconds, response=${JSON.stringify(response)}`);
      return response;
    })
    .catch( (error: Error) => {
      if(error instanceof NotFoundException)
        return new AdminResponseDto(HttpStatus.NOT_FOUND, error.message, []);
      
      if(error instanceof AlreadyExistException)
        return new AdminResponseDto(HttpStatus.BAD_REQUEST, error.message, []);

      this.logger.error(error.stack);
      return new AdminResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    })
  }

  @Get('/users/:companyId')
  findUsers(@Param('companyId', ParseUUIDPipe) companyId: string, @Query() paginationDto: PaginationDto, @Body() searchDto: SearchDto): Promise<AdminResponseDto> {
    this.logger.log(`>>> findUsers: companyId=${companyId}, paginationDto=${JSON.stringify(paginationDto)}, searchDto=${JSON.stringify(searchDto)}`);
    const start = performance.now();
    
    return this.userService.findUsers(companyId, paginationDto, searchDto)
    .then( (dtoList: UserDto[]) => {
      const response = new AdminResponseDto(HttpStatus.OK, "executed", dtoList);
      const end = performance.now();
      this.logger.log(`<<< findUsers: executed, runtime=${(end - start) / 1000} seconds, response=${JSON.stringify(response)}`);
      return response;
    })
    .catch( (error: Error) => {
      if(error instanceof NotFoundException)
        return new AdminResponseDto(HttpStatus.NOT_FOUND, error.message, []);

      this.logger.error(error.stack);
      return new AdminResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    })
  }

  @Get('/users/:companyId/:value')
  findOneUserByValue(@Param('companyId', ParseUUIDPipe) companyId: string, @Param('value') value: string): Promise<AdminResponseDto> {
    this.logger.log(`>>> findOneUserByValue: companyId=${companyId}, value=${value}`);
    const start = performance.now();

    return this.userService.findOneUserByValue(companyId, value)
    .then( (dtoList: UserDto[]) => {
      const response = new AdminResponseDto(HttpStatus.OK, "executed", dtoList);
      const end = performance.now();
      this.logger.log(`<<< findOneUserByValue: executed, runtime=${(end - start) / 1000} seconds, response=${JSON.stringify(response)}`);
      return response;
    })
    .catch( (error: Error) => {
      if(error instanceof NotFoundException)
        return new AdminResponseDto(HttpStatus.NOT_FOUND, error.message, []);

      this.logger.error(error.stack);
      return new AdminResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    })

  }

  @Delete('users/:id')
  removeUser(@Param('id', ParseUUIDPipe) id: string): Promise<AdminResponseDto> {
    this.logger.log(`>>> removeUser: id=${id}`);
    const start = performance.now();

    return this.userService.removeUser(id)
    .then( (msg: string) => {
      const response = new AdminResponseDto(HttpStatus.OK, msg);
      const end = performance.now();
      this.logger.log(`<<< removeUser: executed, runtime=${(end - start) / 1000} seconds, response=${JSON.stringify(response)}`);
      return response;
    })
    .catch( (error: Error) => {
      if(error instanceof NotFoundException)
        return new AdminResponseDto(HttpStatus.NOT_FOUND, error.message, []);
      
      if(error instanceof IsBeingUsedException)
        return new AdminResponseDto(HttpStatus.BAD_REQUEST, error.message, []);

      this.logger.error(error.stack);
      return new AdminResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    })
  }
  
}
