import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  constructor() {
    // Initialisation du client AWS
    // Les identifiants sont récupérés automatiquement depuis les variables d'environnement
    // (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION)
    this.s3Client = new S3Client({ region: process.env.AWS_REGION });
    this.bucketName = 'kodak-express-angouleme-bucket';
  }

  /**
   * Génère une URL sécurisée pour l'upload direct (Presigned URL)
   * @param {string} userId - L'ID du client
   * @param {string} orderId - L'ID de la commande
   * @param {string} fileType - Le type MIME (ex: 'image/jpeg')
   * @param {string} originalName - Nom original pour l'extension
   */
  async generatePresignedUploadUrl(userId, orderId, fileType, originalName) {
    // 1. Sécurisation du nom : on utilise un UUID + l'extension d'origine
    const extension = path.extname(originalName);
    const uniqueFileName = `${uuidv4()}${extension}`;

    // 2. Création de la structure de dossier virtuelle
    // Structure : uploads/user_123/cmd_456/uuid.jpg
    const s3Key = `uploads/${userId}/${orderId}/${uniqueFileName}`;

    // 3. Préparation de la commande S3
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: s3Key,
      ContentType: fileType,
      // Optionnel : on peut ajouter des métadonnées personnalisées
      Metadata: {
        originalName: originalName, // Utile pour retrouver le vrai nom plus tard
      },
    });

    try {
      // 4. Génération de l'URL signée (valide 15 minutes)
      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: 900,
      });

      return {
        uploadUrl: signedUrl, // À renvoyer au Frontend
        key: s3Key, // À sauvegarder dans votre Base de Données
        fileName: uniqueFileName,
      };
    } catch (error) {
      console.error('Erreur S3 Upload URL:', error);
      throw new Error("Impossible de générer l'URL d'upload");
    }
  }

  /**
   * Supprime toutes les images d'une commande (ex: annulation ou nettoyage)
   */
  async deleteOrderFolder(userId, orderId) {
    const prefix = `uploads/${userId}/${orderId}/`;

    // Étape 1 : Lister les objets à supprimer
    const listCommand = new ListObjectsV2Command({
      Bucket: this.bucketName,
      Prefix: prefix,
    });

    const listedObjects = await this.s3Client.send(listCommand);

    if (!listedObjects.Contents || listedObjects.Contents.length === 0) return;

    // Étape 2 : Préparer la suppression en masse
    const deleteParams = {
      Bucket: this.bucketName,
      Delete: { Objects: listedObjects.Contents.map(({ Key }) => ({ Key })) },
    };

    await this.s3Client.send(new DeleteObjectsCommand(deleteParams));
    console.log(`Dossier supprimé : ${prefix}`);
  }
}
