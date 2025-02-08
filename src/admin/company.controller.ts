import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, HttpCode, HttpStatus, Query, ParseUUIDPipe, ParseArrayPipe, NotFoundException } from '@nestjs/common';

import { PaginationDto } from 'src/common/dto/pagination.dto'; 
import { SearchDto } from 'src/common/dto/search.dto';

import { CompanyDto } from './dto/company.dto';
import { AdminResponseDto } from './dto/admin-response-dto';
import { CompanyService } from './company.service';
import { AlreadyExistException, IsBeingUsedException } from './exceptions/admin.exception';

@Controller('siproad-products')
export class CompanyController {

  private readonly logger = new Logger(CompanyController.name);

  constructor(
    private readonly companyService: CompanyService
  ) {}

  @Patch('/companies/update')
  @HttpCode(HttpStatus.OK)
  updateCompany(@Body() dto: CompanyDto): Promise<AdminResponseDto> {
    this.logger.log(`>>> updateCompany: dto=${JSON.stringify(dto)}`);
    const start = performance.now();

    return this.companyService.updateCompany(dto)
    .then( (dto: CompanyDto) => {
      const response = new AdminResponseDto(HttpStatus.OK, 'created/updated', [dto]);
      const end = performance.now();
      this.logger.log(`<<< updateCompany: executed, runtime=${(end - start) / 1000} seconds, response=${JSON.stringify(response)}`);
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

  @Get('/companies')
  findCompanies(@Query() paginationDto: PaginationDto, @Body() searchDto: SearchDto): Promise<AdminResponseDto> {
    this.logger.log(`>>> findCompanies: paginationDto=${JSON.stringify(paginationDto)}, searchDto=${JSON.stringify(searchDto)}`);
    const start = performance.now();
    
    return this.companyService.findCompanies(paginationDto, searchDto)
     .then( (dtoList: CompanyDto[]) => {
      const response = new AdminResponseDto(HttpStatus.OK, "executed", dtoList);
      const end = performance.now();
      this.logger.log(`<<< findCompanies: executed, runtime=${(end - start) / 1000} seconds, response=${JSON.stringify(response)}`);
      return response;
    })
    .catch( (error: Error) => {
      if(error instanceof NotFoundException)
        return new AdminResponseDto(HttpStatus.NOT_FOUND, error.message, []);

      this.logger.error(error.stack);
      return new AdminResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    })
  }

  @Get('/companies/:value')
  findOneCompanyByValue(@Param('value') value: string): Promise<AdminResponseDto> {
    this.logger.log(`>>> findOneCompanyByValue: value=${value}`);
    const start = performance.now();

    return this.companyService.findOneCompanyByValue(value)
    .then( (dtoList: CompanyDto[]) => {
      const response = new AdminResponseDto(HttpStatus.OK, "executed", dtoList);
      const end = performance.now();
      this.logger.log(`<<< findOneCompanyByValue: executed, runtime=${(end - start) / 1000} seconds, response=${JSON.stringify(response)}`);
      return response;
    })
    .catch( (error: Error) => {
      if(error instanceof NotFoundException)
        return new AdminResponseDto(HttpStatus.NOT_FOUND, error.message, []);

      this.logger.error(error.stack);
      return new AdminResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    })

  }

  @Delete('companies/:id')
  removeCompany(@Param('id', ParseUUIDPipe) id: string): Promise<AdminResponseDto> {
    this.logger.log(`>>> removeCompany: id=${id}`);
    const start = performance.now();

    return this.companyService.removeCompany(id)
    .then( (msg: string) => {
      const response = new AdminResponseDto(HttpStatus.OK, msg);
      const end = performance.now();
      this.logger.log(`<<< removeCompany: executed, runtime=${(end - start) / 1000} seconds, response=${JSON.stringify(response)}`);
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
