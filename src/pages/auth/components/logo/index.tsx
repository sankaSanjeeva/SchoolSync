import { motion, Variants } from 'framer-motion'

const opacityVariant: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
}

const pathVariant: Variants = {
  hidden: { pathLength: 0 },
  show: { pathLength: 1 },
}

export default function Logo() {
  return (
    <motion.svg
      width="100%"
      height="100%"
      viewBox="0 0 866 712"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      variants={opacityVariant}
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 1, duration: 1 }}
    >
      <path
        d="M443.986 168.892H440.086V61.915C440.086 45.4941 433.563 29.7458 421.952 18.1345C410.34 6.52317 394.592 8.07647e-09 378.171 8.07647e-09H151.521C143.39 -0.000131315 135.339 1.60122 127.827 4.71262C120.315 7.82401 113.49 12.3845 107.74 18.1338C101.991 23.883 97.4301 30.7084 94.3185 38.2202C91.2068 45.7321 89.6052 53.7832 89.6051 61.914V648.798C89.6051 656.929 91.2066 664.98 94.3181 672.492C97.4296 680.004 101.99 686.829 107.74 692.579C113.489 698.328 120.314 702.888 127.826 706C135.338 709.112 143.389 710.713 151.52 710.713H378.168C394.589 710.713 410.337 704.19 421.949 692.579C433.56 680.967 440.083 665.219 440.083 648.798V245.04H443.983L443.986 168.892Z"
        className="fill-gray-300 dark:fill-gray-800"
      />
      <path
        d="M427.459 57.768V652.943C427.457 665.393 422.511 677.333 413.709 686.137C404.906 694.942 392.967 699.89 380.517 699.895H149.217C136.762 699.897 124.817 694.951 116.008 686.146C107.199 677.341 102.248 665.398 102.244 652.943V57.768C102.248 45.3134 107.198 33.3704 116.007 24.5656C124.815 15.7608 136.761 10.8154 149.215 10.817H177.273C175.895 14.2049 175.371 17.8795 175.746 21.5176C176.121 25.1557 177.384 28.646 179.424 31.6817C181.464 34.7174 184.218 37.2055 187.445 38.9275C190.672 40.6494 194.272 41.5523 197.929 41.557H329.797C333.455 41.5523 337.055 40.6494 340.281 38.9275C343.508 37.2055 346.262 34.7174 348.302 31.6817C350.342 28.646 351.605 25.1557 351.98 21.5176C352.355 17.8795 351.831 14.2049 350.453 10.817H380.508C392.958 10.8191 404.898 15.7651 413.702 24.5677C422.506 33.3704 427.455 45.309 427.459 57.7589V57.768Z"
        className="fill-white dark:fill-gray-900"
      />
      <path
        d="M373.765 572.211H160.153C152.47 572.202 145.105 569.146 139.672 563.714C134.24 558.281 131.184 550.916 131.175 543.233V242.729C131.175 169.767 190.534 110.408 263.496 110.408H373.765C381.448 110.417 388.813 113.472 394.245 118.905C399.678 124.337 402.734 131.702 402.742 139.385V543.233C402.734 550.916 399.678 558.281 394.245 563.714C388.813 569.146 381.447 572.202 373.765 572.211Z"
        className="fill-gray-300 dark:fill-gray-800"
      />
      <path
        d="M147.357 644.547C155.851 644.547 162.736 637.661 162.736 629.168C162.736 620.675 155.851 613.789 147.357 613.789C138.864 613.789 131.979 620.675 131.979 629.168C131.979 637.661 138.864 644.547 147.357 644.547Z"
        className="fill-slate-400 dark:fill-gray-500"
      />
      <path
        d="M388.948 571.619L379.414 582.009L334.805 550.181L348.876 534.847L388.948 571.619Z"
        fill="#FFB6B6"
      />
      <path
        d="M401.45 578.211L370.71 611.71L370.287 611.321C366.829 608.148 364.773 603.731 364.571 599.042C364.37 594.353 366.039 589.776 369.212 586.318L369.213 586.317L370.185 575.938L385.304 568.781L387.987 565.857L401.45 578.211Z"
        fill="#2F2E41"
      />
      <path
        d="M395.181 687.559L381.081 687.558L374.373 633.171L395.184 633.172L395.181 687.559Z"
        fill="#FFB6B6"
      />
      <path
        d="M398.777 701.227L353.312 701.225V700.65C353.312 695.957 355.177 691.456 358.495 688.137C361.814 684.819 366.315 682.954 371.008 682.954H371.009L379.314 676.654L394.809 682.955L398.778 682.955L398.777 701.227Z"
        fill="#2F2E41"
      />
      <path
        d="M327.089 413.002C327.089 413.002 240.951 496.169 295.406 521.912H312.237C312.237 521.912 317.295 503.943 328.874 488.789C330.465 486.708 336.422 487.131 338.076 485.103C348.178 472.72 359.129 462.085 366.692 462.507L371.642 519.932L369.2 536.763C367.662 547.359 368.067 558.146 370.394 568.597L368.672 635.772L398.874 635.789C398.874 635.789 400.094 620.046 401.115 600.355C401.388 595.08 403.657 591.404 403.874 585.789C404.396 572.328 402.668 556.66 402.335 545.674L425.107 424.883L327.089 413.002Z"
        fill="#2F2E41"
      />
      <path
        d="M366.874 236.789L352.829 255.578L319.166 275.378L338.966 326.862L339.717 365.168L337.874 369.789L339.956 377.357C339.956 377.357 338.996 386.214 333.874 392.789C324.921 404.286 311.249 416.781 325.105 419.931C346.887 424.882 424.114 435.772 428.074 426.862C429.444 423.78 429.274 410.746 428.465 395.014C428.314 392.073 425.064 388.872 424.874 385.789C424.732 383.476 427.656 381.3 427.497 378.954C425.731 352.809 423.124 325.873 423.124 325.873L430.874 253.789L399.874 245.789L396.394 236.917L366.874 236.789Z"
        className="fill-gray-500"
      />
      <path
        d="M291.27 516.972L295.874 522.789C295.874 522.789 338.219 552.414 339.673 555.183L346.365 561.515L362.557 544.206L354.137 533.652C347.398 525.206 338.692 518.54 328.78 514.239L315.874 502.789L291.27 516.972Z"
        fill="#2F2E41"
      />
      <path
        d="M318.176 433.824L325.888 359.185L327.923 328.466L306.34 324.563C306.34 324.563 303.108 345.681 300.28 358.074C297.49 370.303 303.997 432.185 304.17 433.817C302.585 435.235 301.467 437.1 300.965 439.166C300.463 441.233 300.601 443.402 301.359 445.389C302.117 447.376 303.46 449.085 305.211 450.292C306.962 451.498 309.038 452.145 311.164 452.146C313.291 452.147 315.367 451.502 317.119 450.298C318.871 449.093 320.216 447.384 320.976 445.398C321.736 443.413 321.876 441.243 321.376 439.176C320.876 437.109 319.76 435.243 318.176 433.824Z"
        fill="#FFB9B9"
      />
      <path
        d="M290.29 371.724L327.549 381.182L327.29 370.724L330.118 367.724L335.768 338.127L343.874 320.789L341.767 261.5L321.179 272.42L321.154 272.439C317.558 276.394 314.551 280.846 312.226 285.659C304.464 301.437 297.008 336.192 293.105 356.378C292.971 356.801 292.712 357.174 292.363 357.448C290.427 359.225 289.163 361.616 288.786 364.217C288.408 366.818 288.94 369.47 290.29 371.724Z"
        className="fill-gray-500"
      />
      <path
        d="M511.551 390.78C511.551 390.78 466.193 342.96 465.77 342.058C462.601 317.997 453.488 307.384 452.122 308.536L428.601 316.684C428.601 316.684 435.597 338.839 440.334 351.999C444.861 364.573 497.027 395.287 497.897 396.803C496.963 398.867 496.677 401.166 497.077 403.395C497.477 405.625 498.545 407.681 500.139 409.291C501.733 410.901 503.778 411.989 506.004 412.411C508.23 412.833 510.531 412.57 512.604 411.655C514.677 410.741 516.423 409.219 517.612 407.29C518.801 405.362 519.377 403.118 519.263 400.855C519.149 398.593 518.35 396.418 516.973 394.619C515.596 392.82 513.706 391.481 511.551 390.78Z"
        fill="#FFB9B9"
      />
      <path
        d="M409.608 255.435C409.608 255.435 432.697 244.119 441.652 266.344C446.562 278.891 459.118 309.342 465.375 328.087C465.417 328.206 465.474 328.319 465.546 328.423C467.219 330.91 468.123 333.835 468.142 336.832C468.14 337.051 468.163 337.268 468.21 337.481C468.21 337.481 442.837 342.424 435.29 355.724L432.297 352.476L431.765 350.2L409.874 291.789L409.608 255.435Z"
        className="fill-gray-500"
      />
      <motion.g variants={opacityVariant} transition={{ duration: 2 }}>
        <path
          d="M785.93 346H516.069C513.665 345.997 511.36 345.035 509.659 343.325C507.959 341.615 507.003 339.296 507 336.877V297.123C507.003 294.704 507.959 292.385 509.659 290.675C511.36 288.965 513.665 288.003 516.069 288H785.93C788.335 288.003 790.64 288.965 792.341 290.675C794.041 292.385 794.997 294.704 795 297.123V336.877C794.997 339.296 794.041 341.615 792.341 343.325C790.64 345.035 788.335 345.997 785.93 346Z"
          className="fill-gray-300 dark:fill-gray-800"
        />
        <path
          d="M759.803 340H522.077C519.671 339.997 517.363 339.029 515.662 337.307C513.96 335.585 513.003 333.25 513 330.815V303.185C513.003 300.75 513.96 298.415 515.662 296.693C517.363 294.971 519.671 294.003 522.077 294H779.923C782.329 294.003 784.637 294.971 786.338 296.693C788.04 298.415 788.997 300.75 789 303.185V310.457C788.991 318.289 785.912 325.799 780.439 331.337C774.965 336.876 767.544 339.991 759.803 340Z"
          className="fill-white dark:fill-gray-900"
        />
        <motion.path
          d="M557 311L687 311"
          className="stroke-theme"
          strokeWidth="5"
          strokeLinecap="round"
          variants={pathVariant}
          transition={{ duration: 1 }}
        />
        <path
          d="M557 321L717 321"
          stroke="#E6E6E6"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </motion.g>
      <motion.g variants={opacityVariant} transition={{ duration: 2 }}>
        <path
          d="M785.93 430H516.069C513.665 429.997 511.36 429.035 509.659 427.325C507.959 425.615 507.003 423.296 507 420.877V381.123C507.003 378.704 507.959 376.385 509.659 374.675C511.36 372.965 513.665 372.003 516.069 372H785.93C788.335 372.003 790.64 372.965 792.341 374.675C794.041 376.385 794.997 378.704 795 381.123V420.877C794.997 423.296 794.041 425.615 792.341 427.325C790.64 429.035 788.335 429.997 785.93 430Z"
          className="fill-gray-300 dark:fill-gray-800"
        />
        <path
          d="M759.803 424H522.077C519.671 423.997 517.363 423.029 515.662 421.307C513.96 419.585 513.003 417.25 513 414.815V387.185C513.003 384.75 513.96 382.415 515.662 380.693C517.363 378.971 519.671 378.003 522.077 378H779.923C782.329 378.003 784.637 378.971 786.338 380.693C788.04 382.415 788.997 384.75 789 387.185V394.457C788.991 402.289 785.912 409.799 780.439 415.337C774.965 420.876 767.544 423.991 759.803 424Z"
          className="fill-white dark:fill-gray-900"
        />
        <motion.path
          d="M557 395L657 395"
          className="stroke-theme"
          strokeWidth="5"
          strokeLinecap="round"
          variants={pathVariant}
          transition={{ duration: 1 }}
        />
        <path
          d="M557 405L737 405"
          stroke="#E6E6E6"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </motion.g>
      <motion.g variants={opacityVariant} transition={{ duration: 2 }}>
        <path
          d="M785.93 514H516.069C513.665 513.997 511.36 513.035 509.659 511.325C507.959 509.615 507.003 507.296 507 504.877V465.123C507.003 462.704 507.959 460.385 509.659 458.675C511.36 456.965 513.665 456.003 516.069 456H785.93C788.335 456.003 790.64 456.965 792.341 458.675C794.041 460.385 794.997 462.704 795 465.123V504.877C794.997 507.296 794.041 509.615 792.341 511.325C790.64 513.035 788.335 513.997 785.93 514Z"
          className="fill-gray-300 dark:fill-gray-800"
        />
        <path
          d="M759.803 508H522.077C519.671 507.997 517.363 507.029 515.662 505.307C513.96 503.585 513.003 501.25 513 498.815V471.185C513.003 468.75 513.96 466.415 515.662 464.693C517.363 462.971 519.671 462.003 522.077 462H779.923C782.329 462.003 784.637 462.971 786.338 464.693C788.04 466.415 788.997 468.75 789 471.185V478.457C788.991 486.289 785.912 493.799 780.439 499.337C774.965 504.876 767.544 507.991 759.803 508Z"
          className="fill-white dark:fill-gray-900"
        />
        <motion.path
          d="M557 479L677 479"
          className="stroke-theme"
          strokeWidth="5"
          strokeLinecap="round"
          variants={pathVariant}
          transition={{ duration: 1 }}
        />
        <path
          d="M557 489L707 489"
          stroke="#E6E6E6"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </motion.g>
      <path
        d="M381.674 230.758C397.288 230.758 409.946 218.1 409.946 202.486C409.946 186.872 397.288 174.214 381.674 174.214C366.06 174.214 353.402 186.872 353.402 202.486C353.402 218.1 366.06 230.758 381.674 230.758Z"
        fill="#FFB9B9"
      />
      <path
        d="M360.887 220.669C360.548 220.67 360.211 220.616 359.889 220.508C358.627 219.955 357.572 219.017 356.875 217.829C352.008 210.828 349.657 201.494 349.89 190.086C349.989 185.259 350.535 179.088 353.915 174.17C356.757 170.034 362.507 166.751 367.865 168.399C367.804 167.327 368.042 166.26 368.553 165.316C369.063 164.372 369.825 163.588 370.755 163.052C372.785 161.809 375.228 161.58 377.383 161.377C382.825 160.867 388.451 160.34 393.962 161.384C400.141 162.556 405.193 165.741 407.823 170.122L407.877 170.259L408.411 172.855C408.483 173.204 408.63 173.534 408.841 173.82C409.052 174.107 409.323 174.345 409.635 174.517C409.947 174.689 410.293 174.792 410.648 174.817C411.003 174.843 411.36 174.791 411.694 174.666C412.058 174.529 412.451 174.489 412.835 174.551C413.219 174.612 413.58 174.773 413.884 175.016C414.187 175.26 414.421 175.579 414.563 175.941C414.705 176.303 414.751 176.696 414.695 177.08L414.546 178.113L416.1 177.822C416.489 177.75 416.89 177.782 417.263 177.915C417.635 178.048 417.966 178.277 418.221 178.579C418.476 178.882 418.646 179.246 418.715 179.636C418.783 180.025 418.747 180.426 418.61 180.797L418.171 181.985C418.492 181.987 418.81 182.055 419.104 182.184C419.399 182.314 419.663 182.502 419.882 182.738C420.196 183.076 420.394 183.506 420.447 183.965C420.5 184.423 420.405 184.887 420.175 185.287C418.438 188.257 415.974 190.737 413.015 192.491C411.398 193.464 409.629 194.16 407.782 194.549C395.797 197.136 383.44 197.507 371.322 195.646C372.039 198.036 372.316 200.537 372.137 203.026C371.749 206.138 369.922 208.707 367.481 209.569C366.926 209.75 366.357 209.887 365.78 209.979C365.228 210.065 364.685 210.197 364.156 210.374C363.371 210.662 362.676 211.153 362.141 211.795C361.606 212.438 361.25 213.21 361.109 214.034C360.968 214.858 361.047 215.705 361.337 216.488C361.628 217.272 362.12 217.966 362.764 218.499L363.967 217.245L363.576 218.839C363.494 219.149 363.348 219.439 363.147 219.689C362.946 219.94 362.695 220.145 362.409 220.291C361.941 220.541 361.418 220.671 360.887 220.669Z"
        fill="#2F2E41"
      />
      <path
        d="M754.18 647.556L755.324 621.837C767.248 615.463 780.548 612.096 794.069 612.029C775.46 627.243 777.786 656.57 765.17 677.029C761.186 683.379 755.824 688.752 749.482 692.749C743.139 696.746 735.978 699.265 728.53 700.118L712.958 709.652C710.821 697.74 711.292 685.506 714.339 673.794C717.386 662.081 722.935 651.168 730.605 641.807C734.96 636.598 739.954 631.958 745.468 627.997C749.198 637.831 754.18 647.556 754.18 647.556Z"
        className="fill-slate-400 dark:fill-gray-500"
      />
      <path
        d="M865.67 710.282C865.67 710.438 865.64 710.593 865.58 710.738C865.521 710.883 865.433 711.014 865.322 711.125C865.212 711.235 865.081 711.323 864.936 711.382C864.791 711.442 864.636 711.473 864.48 711.472H1.19C0.874395 711.472 0.571725 711.347 0.348557 711.123C0.125388 710.9 0 710.598 0 710.282C0 709.966 0.125388 709.664 0.348557 709.441C0.571725 709.217 0.874395 709.092 1.19 709.092H864.48C864.636 709.092 864.791 709.122 864.936 709.182C865.081 709.241 865.212 709.329 865.322 709.44C865.433 709.55 865.521 709.682 865.58 709.826C865.64 709.971 865.67 710.126 865.67 710.282Z"
        className="fill-slate-400 dark:fill-gray-500"
      />
    </motion.svg>
  )
}