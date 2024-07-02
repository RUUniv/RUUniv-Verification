import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { DatabaseService } from 'src/infrastructure/database/database.service';
import {
  EmailVerificationRequest,
  VerifyEmailRequest,
} from '../dto/email-verification.dto';
import {
  AuthCodeNotFoundError,
  DuplicatedVerificationError,
  NotSupportedUniversityError,
  UniversityNotFoundError,
} from 'src/common/errors/verification.error';
import { EmailService } from './email.service';
import { InvalidAuthCodeError } from '../../../common/errors/verification.error';
import { Student } from '@prisma/client';

@Injectable()
export class VerificationService {
  constructor(
    private readonly dataBaseService: DatabaseService,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
    private readonly mailService: EmailService,
  ) {}

  private readonly logger = new Logger(VerificationService.name);

  async createEmailVerification(
    data: EmailVerificationRequest,
  ): Promise<boolean> {
    let title = 'RUUniv';

    if (data.mailTitle) {
      title = data.mailTitle;
    }

    if (await this.cacheService.get('EMAIL_VERIFICATION' + data.email)) {
      this.cacheService.del('EMAIL_VERIFICATION' + data.email);
    }

    const domain = data.email.split('@')[1];
    const domainFound = Object.values(University).some(
      (university) => university.domain && domain.includes(university.domain),
    );

    if (!domainFound) {
      throw new UniversityNotFoundError();
    }

    const authCode = await this.generateRandomNumber(6);

    this.mailService.sendMail(data.email, authCode, title);

    this.cacheService.set('EMAIL_VERIFICATION' + data.email, authCode, 180000);

    this.logger.log(`Create Email Verification Session Email - ${data.email}`);

    return true;
  }

  async verifyEmail(
    data: VerifyEmailRequest,
    apiKeyId: bigint,
  ): Promise<Student> {
    await this.checkDuplicateVerification(data.email, apiKeyId);

    const authCode = await this.cacheService.get(
      'EMAIL_VERIFICATION' + data.email,
    );

    if (!authCode) {
      throw new AuthCodeNotFoundError();
    }

    if (authCode != data.authCode) {
      throw new InvalidAuthCodeError();
    }

    this.cacheService.del('EMAIL_VERIFICATION' + data.email);

    this.logger.log(`Verified Email - ${data.email}`);

    return this.dataBaseService.student.create({
      data: {
        universityName: data.universityName,
        email: data.email,
        apiKeyId: apiKeyId,
      },
    });
  }

  async deleteVerifiedStudents(apiKeyId: bigint): Promise<boolean> {
    await this.dataBaseService.student.deleteMany({
      where: { apiKeyId: apiKeyId },
    });

    return true;
  }

  async getAllSupportedUniversity(): Promise<string[]> {
    return Object.values(University).map((university) => university.name);
  }

  async checkSupportedUniversity(universityName: string): Promise<boolean> {
    const check = Object.values(University).some(
      (university) =>
        university.name && universityName.includes(university.name),
    );

    if (!check) {
      throw new NotSupportedUniversityError();
    }

    return true;
  }

  async getVerifiedStudents(apiKeyId: bigint): Promise<Student[]> {
    return this.dataBaseService.student.findMany({
      where: {
        apiKeyId: apiKeyId,
      },
    });
  }

  private async checkDuplicateVerification(email: string, apiKeyId: bigint) {
    const count = await this.dataBaseService.student.count({
      where: {
        apiKeyId: apiKeyId,
        email: email,
      },
    });

    if (count > 0) {
      throw new DuplicatedVerificationError();
    }
  }

  private async generateRandomNumber(n: number): Promise<string> {
    let str = '';
    for (let i = 0; i < n; i++) {
      str += Math.floor(Math.random() * 10);
    }
    return str;
  }
}

const University = {
  GACHON: { name: '가천대학교', domain: 'gachon' },
  KANGWON: { name: '강원대학교', domain: 'kangwon' },
  KONKUK: { name: '건국대학교', domain: 'konkuk' },
  KKU: { name: '건국대학교(글로컬)', domain: 'kku' },
  GTEC: { name: '경기과학기술대학교', domain: 'gtec' },
  KYONGGI: { name: '경기대학교', domain: 'kyonggi' },
  KNU: { name: '경북대학교', domain: 'knu' },
  GINUE: { name: '경인교육대학교', domain: 'ginue' },
  KHU: { name: '경희대학교', domain: 'khu' },
  KAYWON: { name: '계원예술대학교', domain: 'kaywon' },
  KOREA: { name: '고려대학교', domain: 'korea' },
  KW: { name: '광운대학교', domain: 'kw' },
  KOOKMIN: { name: '국민대학교', domain: 'kookmin' },
  DANKOOK: { name: '단국대학교', domain: 'dankook' },
  DUKSUNG: { name: '덕성여자대학교', domain: 'duksung' },
  DONGGUK: { name: '동국대학교', domain: 'dongguk.edu' },
  DONGGUKK: { name: '동국대학교(경주)', domain: 'dongguk.ac' },
  DONGDUK: { name: '동덕여자대학교', domain: 'dongduk' },
  MJU: { name: '명지대학교', domain: 'mju' },
  MJC: { name: '명지전문대학교', domain: 'mjc' },
  SOGANG: { name: '서강대학교', domain: 'sogang' },
  SKUNIV: { name: '서경대학교', domain: 'skuniv' },
  SEOULTECH: { name: '서울과학기술대학교', domain: 'seoultech' },
  SNUE: { name: '서울교육대학교', domain: 'snue' },
  SNU: { name: '서울대학교', domain: 'snu' },
  UOS: { name: '서울시립대학교', domain: 'uos' },
  SWU: { name: '서울여자대학교', domain: 'swu' },
  SKKU: { name: '성균관대학교', domain: 'skku' },
  SUNGSHIN: { name: '성신여자대학교', domain: 'sungshin' },
  SJU: { name: '세종대학교', domain: 'sju' },
  SOOK: { name: '숙명여자대학교', domain: 'sookmyung' },
  SOONG: { name: '숭실대학교', domain: 'soongsil' },
  AJOU: { name: '아주대학교', domain: 'ajou' },
  YONSEI: { name: '연세대학교', domain: 'yonsei' },
  YNU: { name: '영남대학교', domain: 'ynu' },
  EWHA: { name: '이화여자대학교', domain: 'ewhain' },
  INU: { name: '인천대학교', domain: 'inu' },
  ITC: { name: '인하공전대학교', domain: 'itc' },
  INHA: { name: '인하대학교', domain: 'itc' },
  JNU: { name: '전남대학교', domain: 'jnu' },
  JBNU: { name: '전북대학교', domain: 'jbnu' },
  CAU: { name: '중앙대학교', domain: 'cau' },
  CHUNGBUK: { name: '충북대학교', domain: 'chungbuk' },
  KNOU: { name: '한국방송통신대학교', domain: 'knou' },
  KPU: { name: '한국산업기술대학교', domain: 'kpu' },
  KARTS: { name: '한국예술종합대학교', domain: 'karts' },
  HUFS: { name: '한국외국어대학교', domain: 'hufs' },
  KNSU: { name: '한국체육대학교', domain: 'knsu' },
  HANYANG: { name: '한양대학교', domain: 'hanyang' },
  ERICA: { name: '한양대학교(ERICA)', domain: 'hanyang' },
  HONGIK: { name: '홍익대학교', domain: 'hongik' },
  DGIST: { name: '디지스트', domain: 'dgist' },
  GIST: { name: '지스트', domain: 'gist' },
  KAIST: { name: '카이스트', domain: 'kaist' },
  POSTECH: { name: '포항공과대학교', domain: 'postech' },
  UNIST: { name: '유니스트', domain: 'unist' },
  KMU: { name: '계명대학교', domain: 'kmu' },
  CHOSUN: { name: '조선대학교', domain: 'chosun' },
  GNU: { name: '경상대학교', domain: 'GNU' },
  DONGA: { name: '동아대학교', domain: 'donga' },
  DAEGU: { name: '대구대학교', domain: 'daegu' },
  DEU: { name: '동의대학교', domain: 'deu' },
  CNU: { name: '충남대학교', domain: 'cnu' },
  BUKYONG: { name: '부경대학교', domain: 'bukyong' },
  ISCU: { name: '서울사이버대학교', domain: 'iscu' },
  HYCU: { name: '한양사이버대학교', domain: 'hycu' },
  WONKWANG: { name: '원광대학교', domain: 'wonkwang' },
  KHCU: { name: '경희사이버대학교', domain: 'khcu' },
  SDU: { name: '서울디지털대학교', domain: 'sdu' },
  BU: { name: '백석대학교', domain: 'bu' },
  BC: { name: '부천대학교', domain: 'bc' },
  CU: { name: '대구가톨릭대학교', domain: 'donga' },
  KYWOMAN: { name: '한양여자대학교', domain: 'kywoman' },
  HOSEO: { name: '호서대학교', domain: 'hoseo' },
  YJC: { name: '영진전문대학교', domain: 'yjc' },
  KONGJU: { name: '공주대학교', domain: 'kongju' },
  KS: { name: '경성대학교', domain: 'ks' },
  SHINGU: { name: '신구대학교', domain: 'shingu' },
  HANNAM: { name: '한남대학교', domain: 'hannam' },
  ULSAN: { name: '울산대학교', domain: 'ulsan' },
  DAELIM: { name: '대림대학교', domain: 'daelim' },
  DSC: { name: '동서울대학교', domain: 'dsc' },
  CJU: { name: '청주대학교', domain: 'cju' },
  KIT: { name: '경남정보대학교', domain: 'kit' },
  DONGYANG: { name: '동양미래대학교', domain: 'dongyang' },
  DHC: { name: '대구보건대학교', domain: 'dhc' },
  YEONSUNG: { name: '연성대학교', domain: 'yeonsung' },
  JJ: { name: '전주대학교', domain: 'jj' },
  SEOIL: { name: '서일대학교', domain: 'seoil' },
  INDUK: { name: '인덕대학교', domain: 'induk' },
  CUK: { name: '고려사이버대학교', domain: 'cuk' },
  YNK: { name: '영남이공대학교', domain: 'ync' },
  JANGAN: { name: '장안대학교', domain: 'jangan' },
  SCH: { name: '순천향대학교', domain: 'sch' },
  BSCU: { name: '백석문화대학교', domain: 'bscu' },
  KMCU: { name: '계명문화대학교', domain: 'kmcu' },
  HANMA: { name: '경남대학교', domain: 'hanma' },
  NSU: { name: '남서울대학교', domain: 'nsu' },
  OSAN: { name: '오산대학교', domain: 'osan' },
  SJCU: { name: '세종사이버대학교', domain: 'sjcu' },
  JEJUNU: { name: '제주대학교', domain: 'jejunu' },
  KBU: { name: '경복대학교', domain: 'kbu' },
  MASAN: { name: '마산대학교', domain: 'masan' },
  SUWON: { name: '수원대학교', domain: 'suwon' },
  SANGJI: { name: '상지대학교', domain: 'sangji' },
  SSC: { name: '수원과학대학교', domain: 'ssc' },
  DONGSEO: { name: '동서대학교', domain: 'dongseo' },
  HIT: { name: '대전보건대학교', domain: 'hit' },
  SUNMOON: { name: '선문대학교', domain: 'sunmoon' },
  YUHAN: { name: '유한대학교', domain: 'yuhan' },
  KIC: { name: '경인여자대학교', domain: 'kic' },
  PCU: { name: '배재대학교', domain: 'pcu' },
  SEOYOUNG: { name: '서영대학교', domain: 'seoyoung' },
  WSU: { name: '우송대학교', domain: 'wsu' },
  DJU: { name: '대전대학교', domain: 'dju' },
  JMAIL: { name: '중부대학교', domain: 'jmail' },
  UT: { name: '한국교통대학교', domain: 'ut' },
  INJE: { name: '인제대학교', domain: 'inje' },
  DIT: { name: '동의과학대학교', domain: 'dit' },
  HANBAT: { name: '한밭대학교', domain: 'hanbat' },
  HANSUNG: { name: '한성대학교', domain: 'hansung' },
  SYUIN: { name: '삼육대학교', domain: 'syuin' },
  KAU: { name: '한국항공대학교', domain: 'kau' },
  SEOULARTS: { name: '서울예술대학교', domain: 'seoularts' },
  PUSAN: { name: '부산대학교', domain: 'pusan' },
  SANGMYUNG: { name: '상명대학교', domain: 'sangmyung' },
} as const;
