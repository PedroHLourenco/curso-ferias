import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(createUserDto.password, salt);

    const newUser = this.usersRepository.create({
      username: createUserDto.username,
      email: createUserDto.email,
      passwordHash: passwordHash,
      userRole: createUserDto.role || 'player',
    });

    const savedUser = await this.usersRepository.save(newUser);

    const { passwordHash: _, ...result } = savedUser; // retorna todos os dados, exceto a senha
    return result;
  }

  async findAll() {
    const users = await this.usersRepository.find();

    return users.map((user) => {
      const { passwordHash, ...result } = user; // remove a senha de todos os usuários
      return result;
    });
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado`);
    }

    const { passwordHash, ...result } = user;
    return result;
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    // alteração de senha, criptografa novamente
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    //demais dados a serem atualizados
    const dataToUpdate: any = { ...updateUserDto };

    // se atualizar a senha, faz a criptografia novamente e remove a senha descriptografada
    if (dataToUpdate.password) {
      dataToUpdate.passwordHash = dataToUpdate.password;
      delete dataToUpdate.password;
    }

    await this.usersRepository.update(id, dataToUpdate);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.usersRepository.delete(id);

    return { message: 'Usuário removido com sucesso' };
  }
}
