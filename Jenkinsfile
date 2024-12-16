pipeline {
    agent any
    environment {
        GIT_URL = 'https://gitee.com/anubiscl/video-vant-mobile.git' // GitHub 仓库 URL https://github.com/AnubisCL/video-vant-mobile.git
        BRANCH = 'main' // 替换为你想要构建的分支
        DIST_TAR = 'dist.tar' // 构建后的 dist 目录打包成的 tar 文件名
        DEPLOY_DIR = '/mnt/f/webui' // 替换为你要部署文件的目标目录
    }
    tools {
        // Install the Maven version configured as "M3" and add it to the path.
        nodejs 'nvm-node-18.19.0[Local]'
    }
    stages {
        stage('Checkout') {
            steps {
                git url: GIT_URL,
                branch: BRANCH
            }
        }
        stage('Setup Node.js Environment') {
            steps {
                // 安装 Node.js 和 npm
                sh 'node -v' // 验证 Node.js 版本
                sh 'npm -v' // 验证 npm 版本
                sh 'pnpm -v' // 验证 npm 版本
                sh 'pnpm config set registry https://registry.npmmirror.com/' //设置镜像源
                sh 'vite --version' // 验证 Vite 版本
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'pnpm install' // 使用 Pnpm 安装依赖
            }
        }
        stage('Vite Build dist.tar') {
            steps {
                sh 'vite build --mode=production' // 使用 Vite 构建项目
            }
        }
        stage('Package Dist Directory') {
            steps {
                sh """
                    cd dist/
                    rm -rf dist.tar
                    tar -cvf dist.tar ./*
                    cp dist.tar ${DEPLOY_DIR}/
                """
            }
        }
        stage('Copy and Extract Tar File') {
            steps {
                sh """
                    cd ${DEPLOY_DIR}
                    rm -rf ./video-vant-mobile/
                    mkdir video-vant-mobile
                    tar -xvf ./dist.tar -C ./video-vant-mobile/
                """
            }
        }
    }
}
