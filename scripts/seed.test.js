#!/usr/bin/env node

/**
 * Seed script para popular dados de teste no banco de dados
 * Cria: admin user, test user, 10 livros, 5 posts, 20 comentários em 4 idiomas
 * 
 * Uso: node scripts/seed.test.js
 */

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { users, books, posts, comments } from '../drizzle/schema.js';

const DATABASE_URL = process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/abbleitura';

async function main() {
  console.log('🌱 Iniciando seed de dados...\n');

  try {
    // Parse DATABASE_URL
    const url = new URL(DATABASE_URL);
    const connection = await mysql.createConnection({
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
    });

    const db = drizzle(connection);

    // 1. Criar usuário admin
    console.log('👤 Criando usuário admin...');
    const adminPassword = await bcrypt.hash('Abbleitura@2025!', 10);
    
    await db.insert(users).values({
      openId: 'admin-001',
      name: 'Administrador',
      email: 'admin@abbleitura.com',
      loginMethod: 'email',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    }).onDuplicateKeyUpdate({
      set: {
        name: 'Administrador',
        role: 'admin',
        updatedAt: new Date(),
      }
    });

    console.log('✅ Admin criado: admin@abbleitura.com / Abbleitura@2025!\n');

    // 2. Criar usuário de teste
    console.log('👤 Criando usuário de teste...');
    const testPassword = await bcrypt.hash('Test1234!', 10);
    
    await db.insert(users).values({
      openId: 'test-user-001',
      name: 'Usuário Teste',
      email: 'test@abbleitura.com',
      loginMethod: 'email',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    }).onDuplicateKeyUpdate({
      set: {
        name: 'Usuário Teste',
        updatedAt: new Date(),
      }
    });

    console.log('✅ Usuário teste criado: test@abbleitura.com / Test1234!\n');

    // 3. Criar 10 livros de exemplo
    console.log('📚 Criando 10 livros de exemplo...');
    
    const booksData = [
      {
        slug: 'o-cortico',
        title: JSON.stringify({ 'pt-BR': 'O Cortiço', 'en': 'The Tenement', 'es': 'El Conventillo', 'fr': 'La Cour', 'zh': '贫民区' }),
        synopsis: JSON.stringify({ 'pt-BR': 'Romance naturalista de Aluísio Azevedo', 'en': 'A naturalistic novel by Aluísio Azevedo', 'es': 'Una novela naturalista de Aluísio Azevedo', 'fr': 'Un roman naturaliste d\'Aluísio Azevedo', 'zh': '阿鲁西奥·阿泽维多的自然主义小说' }),
        isbn: '978-8535914789',
        metadata: JSON.stringify({ genre: 'fiction', year: 1890, author: 'Aluísio Azevedo', pages: 356 }),
        tags: JSON.stringify(['romance', 'clássico', 'português']),
        languages: JSON.stringify(['pt-BR', 'en', 'es', 'fr', 'zh']),
        popularityScore: 85,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        slug: 'dom-casmurro',
        title: JSON.stringify({ 'pt-BR': 'Dom Casmurro', 'en': 'Dom Casmurro', 'es': 'Dom Casmurro', 'fr': 'Dom Casmurro', 'zh': '卡斯穆罗先生' }),
        synopsis: JSON.stringify({ 'pt-BR': 'Clássico de Machado de Assis', 'en': 'A classic by Machado de Assis', 'es': 'Un clásico de Machado de Assis', 'fr': 'Un classique de Machado de Assis', 'zh': '马查多·德·阿西斯的经典著作' }),
        isbn: '978-8535902778',
        metadata: JSON.stringify({ genre: 'fiction', year: 1899, author: 'Machado de Assis', pages: 256 }),
        tags: JSON.stringify(['romance', 'clássico', 'português']),
        languages: JSON.stringify(['pt-BR', 'en', 'es']),
        popularityScore: 92,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        slug: 'grande-sertao-veredas',
        title: JSON.stringify({ 'pt-BR': 'Grande Sertão: Veredas', 'en': 'The Devil to Pay in the Backlands', 'es': 'Gran Sertón: Veredas', 'fr': 'Le Grand Sertão', 'zh': '大荒漠：小径' }),
        synopsis: JSON.stringify({ 'pt-BR': 'Obra-prima de Guimarães Rosa', 'en': 'A masterpiece by Guimarães Rosa', 'es': 'Una obra maestra de Guimarães Rosa', 'fr': 'Un chef-d\'œuvre de Guimarães Rosa', 'zh': '吉马朗埃斯·罗萨的杰作' }),
        isbn: '978-8535914770',
        metadata: JSON.stringify({ genre: 'fiction', year: 1956, author: 'Guimarães Rosa', pages: 622 }),
        tags: JSON.stringify(['romance', 'clássico', 'português', 'sertão']),
        languages: JSON.stringify(['pt-BR', 'en', 'es', 'fr', 'zh']),
        popularityScore: 88,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        slug: 'vidas-secas',
        title: JSON.stringify({ 'pt-BR': 'Vidas Secas', 'en': 'Barren Lives', 'es': 'Vidas Secas', 'fr': 'Vies Arides', 'zh': '干涸的生活' }),
        synopsis: JSON.stringify({ 'pt-BR': 'Clássico de Graciliano Ramos', 'en': 'A classic by Graciliano Ramos', 'es': 'Un clásico de Graciliano Ramos', 'fr': 'Un classique de Graciliano Ramos', 'zh': '格拉西利亚诺·拉莫斯的经典著作' }),
        isbn: '978-8535902761',
        metadata: JSON.stringify({ genre: 'fiction', year: 1938, author: 'Graciliano Ramos', pages: 128 }),
        tags: JSON.stringify(['romance', 'clássico', 'português', 'seca']),
        languages: JSON.stringify(['pt-BR', 'en', 'es']),
        popularityScore: 80,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        slug: 'memórias-póstumas-brás-cubas',
        title: JSON.stringify({ 'pt-BR': 'Memórias Póstumas de Brás Cubas', 'en': 'Posthumous Memoirs of Brás Cubas', 'es': 'Memorias Póstumas de Brás Cubas', 'fr': 'Mémoires Posthumes de Brás Cubas', 'zh': '布拉斯·库巴斯的遗作回忆录' }),
        synopsis: JSON.stringify({ 'pt-BR': 'Obra revolucionária de Machado de Assis', 'en': 'A revolutionary work by Machado de Assis', 'es': 'Una obra revolucionaria de Machado de Assis', 'fr': 'Une œuvre révolutionnaire de Machado de Assis', 'zh': '马查多·德·阿西斯的革命性著作' }),
        isbn: '978-8535902754',
        metadata: JSON.stringify({ genre: 'fiction', year: 1881, author: 'Machado de Assis', pages: 368 }),
        tags: JSON.stringify(['romance', 'clássico', 'português', 'satírico']),
        languages: JSON.stringify(['pt-BR', 'en', 'es', 'fr', 'zh']),
        popularityScore: 95,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        slug: 'capitaes-da-areia',
        title: JSON.stringify({ 'pt-BR': 'Capitães da Areia', 'en': 'Captains of the Sands', 'es': 'Capitanes de la Arena', 'fr': 'Capitaines des Sables', 'zh': '沙漠之船长' }),
        synopsis: JSON.stringify({ 'pt-BR': 'Clássico de Jorge Amado', 'en': 'A classic by Jorge Amado', 'es': 'Un clásico de Jorge Amado', 'fr': 'Un classique de Jorge Amado', 'zh': '豪尔赫·阿马多的经典著作' }),
        isbn: '978-8535902747',
        metadata: JSON.stringify({ genre: 'fiction', year: 1937, author: 'Jorge Amado', pages: 280 }),
        tags: JSON.stringify(['romance', 'clássico', 'português', 'aventura']),
        languages: JSON.stringify(['pt-BR', 'en', 'es', 'fr']),
        popularityScore: 82,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        slug: 'quincas-borba',
        title: JSON.stringify({ 'pt-BR': 'Quincas Borba', 'en': 'Quincas Borba', 'es': 'Quincas Borba', 'fr': 'Quincas Borba', 'zh': '昆卡斯·博尔巴' }),
        synopsis: JSON.stringify({ 'pt-BR': 'Obra de Machado de Assis', 'en': 'A work by Machado de Assis', 'es': 'Una obra de Machado de Assis', 'fr': 'Une œuvre de Machado de Assis', 'zh': '马查多·德·阿西斯的作品' }),
        isbn: '978-8535902730',
        metadata: JSON.stringify({ genre: 'fiction', year: 1891, author: 'Machado de Assis', pages: 304 }),
        tags: JSON.stringify(['romance', 'clássico', 'português']),
        languages: JSON.stringify(['pt-BR', 'en', 'es']),
        popularityScore: 78,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        slug: 'gabriela-cravo-canela',
        title: JSON.stringify({ 'pt-BR': 'Gabriela, Cravo e Canela', 'en': 'Gabriela, Clove and Cinnamon', 'es': 'Gabriela, Clavo y Canela', 'fr': 'Gabriela, Clou et Cannelle', 'zh': '加布里埃拉，丁香和肉桂' }),
        synopsis: JSON.stringify({ 'pt-BR': 'Romance de Jorge Amado', 'en': 'A novel by Jorge Amado', 'es': 'Una novela de Jorge Amado', 'fr': 'Un roman de Jorge Amado', 'zh': '豪尔赫·阿马多的小说' }),
        isbn: '978-8535902723',
        metadata: JSON.stringify({ genre: 'fiction', year: 1958, author: 'Jorge Amado', pages: 312 }),
        tags: JSON.stringify(['romance', 'clássico', 'português', 'amor']),
        languages: JSON.stringify(['pt-BR', 'en', 'es', 'fr', 'zh']),
        popularityScore: 86,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        slug: 'iracema',
        title: JSON.stringify({ 'pt-BR': 'Iracema', 'en': 'Iracema', 'es': 'Iracema', 'fr': 'Iracema', 'zh': '伊拉塞玛' }),
        synopsis: JSON.stringify({ 'pt-BR': 'Clássico de José de Alencar', 'en': 'A classic by José de Alencar', 'es': 'Un clásico de José de Alencar', 'fr': 'Un classique de José de Alencar', 'zh': '何塞·德·阿伦卡的经典著作' }),
        isbn: '978-8535902716',
        metadata: JSON.stringify({ genre: 'fiction', year: 1865, author: 'José de Alencar', pages: 176 }),
        tags: JSON.stringify(['romance', 'clássico', 'português', 'indígena']),
        languages: JSON.stringify(['pt-BR', 'en', 'es', 'fr']),
        popularityScore: 81,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        slug: 'o-primo-basilio',
        title: JSON.stringify({ 'pt-BR': 'O Primo Basílio', 'en': 'Cousin Basilio', 'es': 'El Primo Basilio', 'fr': 'Le Cousin Basile', 'zh': '表哥巴西利奥' }),
        synopsis: JSON.stringify({ 'pt-BR': 'Romance de Eça de Queirós', 'en': 'A novel by Eça de Queirós', 'es': 'Una novela de Eça de Queirós', 'fr': 'Un roman d\'Eça de Queirós', 'zh': '埃萨·德·奎罗斯的小说' }),
        isbn: '978-8535902709',
        metadata: JSON.stringify({ genre: 'fiction', year: 1878, author: 'Eça de Queirós', pages: 288 }),
        tags: JSON.stringify(['romance', 'clássico', 'português', 'drama']),
        languages: JSON.stringify(['pt-BR', 'en', 'es', 'fr', 'zh']),
        popularityScore: 79,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const bookData of booksData) {
      await db.insert(books).values(bookData).onDuplicateKeyUpdate({
        set: {
          updatedAt: new Date(),
        }
      });
    }

    console.log('✅ 10 livros criados\n');

    // 4. Criar 5 posts de blog
    console.log('📝 Criando 5 posts de blog...');
    
    const postsData = [
      {
        slug: 'literatura-brasileira-classica',
        title: JSON.stringify({ 'pt-BR': 'Literatura Brasileira Clássica', 'en': 'Classical Brazilian Literature', 'es': 'Literatura Brasileña Clásica', 'fr': 'Littérature Brésilienne Classique', 'zh': '巴西古典文学' }),
        content: JSON.stringify({ 'pt-BR': 'Explore os grandes clássicos da literatura brasileira...', 'en': 'Explore the great classics of Brazilian literature...', 'es': 'Explora los grandes clásicos de la literatura brasileña...', 'fr': 'Explorez les grands classiques de la littérature brésilienne...', 'zh': '探索巴西文学的伟大经典...' }),
        tags: JSON.stringify(['literatura', 'clássico', 'brasil']),
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        slug: 'traducao-automatica-desafios',
        title: JSON.stringify({ 'pt-BR': 'Tradução Automática: Desafios e Oportunidades', 'en': 'Automatic Translation: Challenges and Opportunities', 'es': 'Traducción Automática: Desafíos y Oportunidades', 'fr': 'Traduction Automatique: Défis et Opportunités', 'zh': '自动翻译：挑战和机遇' }),
        content: JSON.stringify({ 'pt-BR': 'Como a tradução automática está transformando a publicação...', 'en': 'How automatic translation is transforming publishing...', 'es': 'Cómo la traducción automática está transformando la publicación...', 'fr': 'Comment la traduction automatique transforme l\'édition...', 'zh': '自动翻译如何改变出版业...' }),
        tags: JSON.stringify(['tradução', 'tecnologia', 'publicação']),
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        slug: 'dicas-leitura-2025',
        title: JSON.stringify({ 'pt-BR': 'Dicas de Leitura para 2025', 'en': 'Reading Tips for 2025', 'es': 'Consejos de Lectura para 2025', 'fr': 'Conseils de Lecture pour 2025', 'zh': '2025年阅读建议' }),
        content: JSON.stringify({ 'pt-BR': 'Descubra os melhores livros para ler este ano...', 'en': 'Discover the best books to read this year...', 'es': 'Descubre los mejores libros para leer este año...', 'fr': 'Découvrez les meilleurs livres à lire cette année...', 'zh': '发现今年最好的书籍...' }),
        tags: JSON.stringify(['leitura', 'recomendação', '2025']),
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        slug: 'autores-brasileiros-contemporaneos',
        title: JSON.stringify({ 'pt-BR': 'Autores Brasileiros Contemporâneos', 'en': 'Contemporary Brazilian Authors', 'es': 'Autores Brasileños Contemporáneos', 'fr': 'Auteurs Brésiliens Contemporains', 'zh': '当代巴西作家' }),
        content: JSON.stringify({ 'pt-BR': 'Conheça os autores que estão marcando presença...', 'en': 'Meet the authors who are making their mark...', 'es': 'Conoce a los autores que están dejando huella...', 'fr': 'Rencontrez les auteurs qui laissent leur marque...', 'zh': '认识正在崭露头角的作家...' }),
        tags: JSON.stringify(['autores', 'contemporâneo', 'brasil']),
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        slug: 'plataforma-leitura-digital',
        title: JSON.stringify({ 'pt-BR': 'O Futuro da Leitura Digital', 'en': 'The Future of Digital Reading', 'es': 'El Futuro de la Lectura Digital', 'fr': 'L\'Avenir de la Lecture Numérique', 'zh': '数字阅读的未来' }),
        content: JSON.stringify({ 'pt-BR': 'Como as plataformas digitais estão revolucionando...', 'en': 'How digital platforms are revolutionizing...', 'es': 'Cómo las plataformas digitales están revolucionando...', 'fr': 'Comment les plateformes numériques révolutionnent...', 'zh': '数字平台如何革新...' }),
        tags: JSON.stringify(['digital', 'leitura', 'futuro']),
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const postData of postsData) {
      await db.insert(posts).values(postData).onDuplicateKeyUpdate({
        set: {
          updatedAt: new Date(),
        }
      });
    }

    console.log('✅ 5 posts criados\n');

    // 5. Criar 20 comentários em 4 idiomas
    console.log('💬 Criando 20 comentários...');
    
    const commentsData = [
      { text: 'Excelente livro! Recomendo muito.', language: 'pt-BR', status: 'published' },
      { text: 'Wonderful book! I highly recommend it.', language: 'en', status: 'published' },
      { text: '¡Excelente libro! Lo recomiendo mucho.', language: 'es', status: 'published' },
      { text: 'Excellent livre! Je le recommande vivement.', language: 'fr', status: 'published' },
      { text: '很好的书！我强烈推荐。', language: 'zh', status: 'published' },
      { text: 'Adorei a história e os personagens.', language: 'pt-BR', status: 'published' },
      { text: 'I loved the story and the characters.', language: 'en', status: 'published' },
      { text: 'Me encantó la historia y los personajes.', language: 'es', status: 'published' },
      { text: 'J\'ai adoré l\'histoire et les personnages.', language: 'fr', status: 'published' },
      { text: '我喜欢这个故事和角色。', language: 'zh', status: 'published' },
      { text: 'Uma obra-prima da literatura brasileira.', language: 'pt-BR', status: 'published' },
      { text: 'A masterpiece of Brazilian literature.', language: 'en', status: 'published' },
      { text: 'Una obra maestra de la literatura brasileña.', language: 'es', status: 'published' },
      { text: 'Un chef-d\'œuvre de la littérature brésilienne.', language: 'fr', status: 'published' },
      { text: '巴西文学的杰作。', language: 'zh', status: 'published' },
      { text: 'Não consegui parar de ler!', language: 'pt-BR', status: 'published' },
      { text: 'I couldn\'t stop reading!', language: 'en', status: 'published' },
      { text: '¡No podía dejar de leer!', language: 'es', status: 'published' },
      { text: 'Je ne pouvais pas arrêter de lire!', language: 'fr', status: 'published' },
      { text: '我停不下来！', language: 'zh', status: 'published' },
    ];

    for (let i = 0; i < commentsData.length; i++) {
      const comment = commentsData[i];
      await db.insert(comments).values({
        text: comment.text,
        language: comment.language,
        status: comment.status,
        bookId: (i % 10) + 1, // Distribuir entre os 10 livros
        userId: i % 2 === 0 ? 1 : 2, // Alternar entre admin e test user
        createdAt: new Date(),
        updatedAt: new Date(),
      }).onDuplicateKeyUpdate({
        set: {
          updatedAt: new Date(),
        }
      });
    }

    console.log('✅ 20 comentários criados\n');

    console.log('✨ Seed concluído com sucesso!\n');
    console.log('📊 Resumo:');
    console.log('  ✓ 1 usuário admin');
    console.log('  ✓ 1 usuário de teste');
    console.log('  ✓ 10 livros');
    console.log('  ✓ 5 posts de blog');
    console.log('  ✓ 20 comentários\n');
    console.log('🔐 Credenciais de Admin:');
    console.log('  Email: admin@abbleitura.com');
    console.log('  Senha: Abbleitura@2025!\n');
    console.log('⚠️  IMPORTANTE: Altere a senha no primeiro login!\n');

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro durante seed:', error);
    process.exit(1);
  }
}

main();
