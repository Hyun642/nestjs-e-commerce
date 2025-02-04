import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      //토큰이 유효한지 체크하기 위해 키 삽입
      secretOrKey: process.env.JWT_SECRET,
      //헤더에 담겨있는 토큰을 인증
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 만료된 토큰 거부
      ignoreExpiration: false,
    });
  }
  async validate(payload: any) {
    return { payload }; // 요청 객체에 사용자 정보 추가
  }
}
