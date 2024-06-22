import { INestApplication } from "@nestjs/common";
import { ApiTags, DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
export const setupSwagger = (app: INestApplication): void => {
    

    const config = new DocumentBuilder()
        .setTitle("Univ Api 문서")
        .setDescription("Api 문서 입니다.")
        .setVersion("v1")
        

    const document = SwaggerModule.createDocument(app, config.build());

    SwaggerModule.setup('swagger', app, document);
};