# Reviva Ateliê |  Velas & Aromas

E-commerce completo (front + back) para uma loja de velas artesanais, home sprays e difusores.

## Estrutura

```
reviva/
├── frontend/   Angular + TypeScript + SCSS
└── backend/    Spring Boot + PostgreSQL + Mercado Pago SDK
```

## Frontend (Angular)

### Requisitos
- Node.js 20+
- Angular CLI 17 (`npm install -g @angular/cli`)

`npm install @mercadopago/sdk-js`

### Rodando localmente
```bash
cd frontend
npm install
npm start
```
Acesse `http://localhost:4200`.

### Onde entram as fotos reais
Cada produto tem um campo `imagePlaceholder` em
`src/app/core/services/product.service.ts`. Os cartões de produto
(`product-card.component.html`) e o carrinho hoje mostram um bloco de
"Foto do produto" no lugar da imagem. Basta:
1. Colocar os arquivos em `frontend/public/assets/produtos/`.
2. Trocar o bloco `<div class="product-card__image">` por
   `<img [src]="product.imagePlaceholder" [alt]="product.name">`.

### Páginas
- **Início** (`/`) — vitrine com produtos em destaque.
- **Produtos** (`/produtos`) — catálogo com filtro por categoria.
- **Carrinho** (`/carrinho`) — soma automática de quantidade e valor total.
- **Checkout** (`/checkout`) — dados do cliente + forma de pagamento (Pix, crédito ou débito) e envio do pedido para a API.
- **Contato** (`/contato`) — formulário de contato.

## Backend (Spring Boot)

### Requisitos
- Java 17+
- Maven 3.9+
- PostgreSQL 14+
- Conta no Mercado Pago (Access Token de teste ou produção)
- Conta de e-mail com senha de app (para envio via SMTP)

### Banco de dados
Crie o banco antes de iniciar a aplicação:
```sql
CREATE DATABASE reviva_velas;
```
Ao subir a aplicação, o Hibernate cria as tabelas automaticamente
(`spring.jpa.hibernate.ddl-auto=update`) e o `data.sql` popula o catálogo inicial.

### Variáveis de ambiente
Configure antes de rodar (ou edite `application.properties` diretamente):

| Variável | Descrição |
|---|---|
| `DB_USERNAME` / `DB_PASSWORD` | Credenciais do PostgreSQL |
| `MAIL_USERNAME` | E-mail usado para enviar as notificações (ex.: `saleskauan308@gmail.com`) |
| `MAIL_PASSWORD` | Senha de app do Gmail (não é a senha normal da conta) |
| `MP_ACCESS_TOKEN` | Access Token do Mercado Pago |
| `CORS_ALLOWED_ORIGIN` | URL do frontend, ex.: `http://localhost:4200` |

O destino fixo das notificações de pedido está em
`loja.email.destino=saleskauan308@gmail.com` (`application.properties`).

### Rodando localmente
```bash
cd backend
mvn spring-boot:run
```
API disponível em `http://localhost:8080/api`.

### Endpoints
- `GET /api/produtos` — lista todos os produtos.
- `GET /api/produtos/{id}` — detalhe de um produto.
- `POST /api/pedidos` — cria um pedido, processa o pagamento no Mercado Pago e envia o e-mail de notificação com todos os dados do cliente, itens e forma de pagamento.

### Sobre a integração com Mercado Pago
O `MercadoPagoService` usa o `sdk-java` oficial para criar um pagamento
(`PaymentClient`). Para cartão de crédito/débito, em produção o token do
cartão deve ser gerado no navegador com o **Checkout Bricks / Secure
Fields** do Mercado Pago (o número do cartão nunca deve passar pelo seu
backend) e enviado junto no `PaymentCreateRequest`. Este projeto traz a
estrutura pronta para você plugar esse token; hoje ele simula os
métodos de pagamento pelo `paymentMethodId` para fins de demonstração.
Para Pix, o Mercado Pago retorna o QR Code e o código copia-e-cola, que
podem ser expostos no `OrderResponseDto`.

### Fluxo do e-mail de pedido
Toda vez que `POST /api/pedidos` é chamado com sucesso, o
`EmailService` monta um resumo com:
- Dados do cliente (nome, e-mail, telefone, endereço)
- Lista de produtos, quantidades e subtotais
- Valor total
- Forma de pagamento escolhida e parcelas (se cartão de crédito)
- Status do pagamento retornado pelo Mercado Pago

e envia para `saleskauan308@gmail.com`.

## Paleta de cores utilizada
Tons quentes e acolhedores, inspirados em velas e aromas:
`#fbf3e7` (creme), `#ecdcc2` (bege), `#d9bd98` (areia),
`#c98a68` (terracota), `#b5754d` (âmbar) e `#4a3327` (marrom escuro),
definidos como variáveis CSS em `frontend/src/styles.scss`.
