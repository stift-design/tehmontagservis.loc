<?php
/**
 * Основные параметры WordPress.
 *
 * Скрипт для создания wp-config.php использует этот файл в процессе
 * установки. Необязательно использовать веб-интерфейс, можно
 * скопировать файл в "wp-config.php" и заполнить значения вручную.
 *
 * Этот файл содержит следующие параметры:
 *
 * * Настройки MySQL
 * * Секретные ключи
 * * Префикс таблиц базы данных
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** Параметры MySQL: Эту информацию можно получить у вашего хостинг-провайдера ** //
/** Имя базы данных для WordPress */
define('DB_NAME', 'stift');

/** Имя пользователя MySQL */
define('DB_USER', 'stift');

/** Пароль к базе данных MySQL */
define('DB_PASSWORD', 'xWohsfUp0PnNTKaY');

/** Имя сервера MySQL */
define('DB_HOST', 'localhost');

/** Кодировка базы данных для создания таблиц. */
define('DB_CHARSET', 'utf8');

/** Схема сопоставления. Не меняйте, если не уверены. */
define('DB_COLLATE', '');

/**#@+
 * Уникальные ключи и соли для аутентификации.
 *
 * Смените значение каждой константы на уникальную фразу.
 * Можно сгенерировать их с помощью {@link https://api.wordpress.org/secret-key/1.1/salt/ сервиса ключей на WordPress.org}
 * Можно изменить их, чтобы сделать существующие файлы cookies недействительными. Пользователям потребуется авторизоваться снова.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         ':UgNCh:-~]zH_G;cE)lfV.3V+ KZg4KL}wGP0JxXmTmp3<>s7u~Qr4KqK%C]2A _');
define('SECURE_AUTH_KEY',  'L!$|rHf5O+x]t3Y9P-tfr.U={J`g{*v>BgdRkdz|Qsz+Di(D2gfTm@+7TaPP@m7|');
define('LOGGED_IN_KEY',    'G,xLILZSRrb&dI8=+U[.OZ+9;> G2U0}^^MM@V1g+rHC2-|Gm86o)X]9ZE^*|ny*');
define('NONCE_KEY',        'F/juP&NO_a,5wSa**RBQ v(Oa(JO n?vAn)[BdxAsa3W#%[-^&W1`VNRCU2V:oDp');
define('AUTH_SALT',        '6RTjLUy<S-AAA56JE0B#67TA%16H-c*L(@k+Y=qw#g*W^THZ6yc||LpCtEi-s8kx');
define('SECURE_AUTH_SALT', 't82od&U58dl)K-JF<z+l6AL0M))T+0^WFiMS{M3ubF;{18WtoXx @Gwpoj~L[ee ');
define('LOGGED_IN_SALT',   'T48t)?DnZbv#Bw#(Tpyu1y!+Gp{0Fg?5^{HSR+)I5WKu}IdwYPh*rOH?-w1X?0,i');
define('NONCE_SALT',       ' jYs iZpT+rbjQTp+9WZ|a]@y$>y9vgao0k,DN##61V<9P9xEjpzP*D+`C|Pu+P`');

/**#@-*/

/**
 * Префикс таблиц в базе данных WordPress.
 *
 * Можно установить несколько сайтов в одну базу данных, если использовать
 * разные префиксы. Пожалуйста, указывайте только цифры, буквы и знак подчеркивания.
 */
$table_prefix  = 'stift_';

/**
 * Для разработчиков: Режим отладки WordPress.
 *
 * Измените это значение на true, чтобы включить отображение уведомлений при разработке.
 * Разработчикам плагинов и тем настоятельно рекомендуется использовать WP_DEBUG
 * в своём рабочем окружении.
 *
 * Информацию о других отладочных константах можно найти в Кодексе.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* Это всё, дальше не редактируем. Успехов! */

/** Абсолютный путь к директории WordPress. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Инициализирует переменные WordPress и подключает файлы. */
require_once(ABSPATH . 'wp-settings.php');
